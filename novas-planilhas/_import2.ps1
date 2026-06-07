Add-Type -AssemblyName System.IO.Compression.FileSystem
$inv = [System.Globalization.CultureInfo]::InvariantCulture

function Get-Repeat($node, $attr) { $v = $node.GetAttribute($attr); $n = 1; if ([int]::TryParse($v, [ref]$n)) { return $n }; return 1 }

function Normalize-Ascii($s) {
  if ($null -eq $s) { return '' }
  $n = ([string]$s).Normalize([Text.NormalizationForm]::FormD); $sb = New-Object Text.StringBuilder
  foreach ($ch in $n.ToCharArray()) { if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) { [void]$sb.Append($ch) } }
  return $sb.ToString().ToUpperInvariant().Trim()
}

function To-Iso($s) {
  if ($null -eq $s) { return $null }
  $m = [regex]::Match(([string]$s).Trim(), '^(\d{1,2})[/\.\-](\d{1,2})[/\.\-](\d{2,4})$')
  if (-not $m.Success) { return $null }
  $d = [int]$m.Groups[1].Value; $mo = [int]$m.Groups[2].Value; $y = [int]$m.Groups[3].Value
  if ($y -lt 100) { $y += 2000 }
  if ($mo -lt 1 -or $mo -gt 12 -or $d -lt 1 -or $d -gt 31) { return $null }
  return ('{0:0000}-{1:00}-{2:00}' -f $y, $mo, $d)
}
function Is-Date($s) { return $null -ne (To-Iso $s) }

function To-Num($s) {
  if ($null -eq $s) { return $null }
  $t = (([string]$s).Trim()) -replace '[^\d,\.\-]', ''
  if ($t -eq '' -or $t -eq '-') { return $null }
  if (($t -match '\.') -and ($t -match ',')) { $t = ($t -replace '\.', '') -replace ',', '.' }
  elseif ($t -match ',') { $t = $t -replace ',', '.' }
  $n = 0.0
  if ([double]::TryParse($t, [Globalization.NumberStyles]::Any, $inv, [ref]$n)) { return [math]::Round($n, 2) }
  return $null
}

function Build-Matrix($table, $ns) {
  $rows = New-Object System.Collections.Generic.List[object]; $rIdx = 0
  foreach ($row in $table.SelectNodes('table:table-row', $ns)) {
    $rRepeat = Get-Repeat $row 'table:number-rows-repeated'
    $cells = New-Object System.Collections.Generic.List[string]
    foreach ($c in $row.SelectNodes('table:table-cell', $ns)) {
      $rep = Get-Repeat $c 'table:number-columns-repeated'; if ($rep -gt 40) { $rep = 1 }
      $txt = ($c.SelectNodes('.//text:p', $ns) | ForEach-Object { $_.InnerText }) -join ' '
      $val = $c.GetAttribute('office:value'); $o = if ($txt -ne '') { $txt } else { $val }
      for ($i = 0; $i -lt $rep; $i++) { $cells.Add($o.Trim()) }
    }
    if ($rRepeat -gt 5) { $rRepeat = 1 }
    for ($k = 0; $k -lt $rRepeat; $k++) { $rows.Add($cells.ToArray()) }
    $rIdx += $rRepeat; if ($rIdx -gt 250) { break }
  }
  return $rows
}

function Cell($m, $r, $c) { if ($r -lt 0 -or $r -ge $m.Count) { return '' }; $row = $m[$r]; if ($c -lt 0 -or $c -ge $row.Count) { return '' }; return [string]$row[$c] }

function Find-Marker($m, $pat, $minCol = 0) {
  for ($r = 0; $r -lt $m.Count; $r++) { $row = $m[$r]; for ($c = $minCol; $c -lt $row.Count; $c++) { if ((Normalize-Ascii $row[$c]) -match $pat) { return @($r, $c) } } }
  return $null
}

function Best-NumCol($m, $r0, $cLo, $cHi, $min, $max, $span) {
  $cBest = -1; $best = 0
  for ($c = [math]::Max(0, $cLo); $c -le $cHi; $c++) {
    $cnt = 0
    for ($r = $r0 + 1; $r -lt [math]::Min($r0 + $span, $m.Count); $r++) { $n = To-Num (Cell $m $r $c); if ($null -ne $n -and $n -ge $min -and $n -le $max) { $cnt++ } }
    if ($cnt -gt $best) { $best = $cnt; $cBest = $c }
  }
  return $cBest
}

# ---- Documentação / Materiais (colunas A-C) ----
function Extract-Main($m) {
  $out = New-Object System.Collections.Generic.List[object]; $start = 0
  for ($r = 0; $r -lt $m.Count; $r++) { if ((Normalize-Ascii (Cell $m $r 0)) -match '^SAIDAS?$') { $start = $r + 1; break } }
  for ($r = $start; $r -lt $m.Count; $r++) {
    $name = (Cell $m $r 0).Trim(); $val = To-Num (Cell $m $r 2)
    if ($name -ne '' -and $null -ne $val) { $out.Add([ordered]@{ name = $name; date = (To-Iso (Cell $m $r 1)); value = $val }) }
  }
  return $out
}

# ---- Pagamentos: tabela cujo marcador está em $mkPat ----
function Extract-Payments($m, $mkPat, $minCol) {
  $out = New-Object System.Collections.Generic.List[object]
  $mk = Find-Marker $m $mkPat $minCol
  if ($null -eq $mk) { return $out }
  $r0 = $mk[0]; $cMk = $mk[1]
  $cVal = Best-NumCol $m $r0 $cMk ($cMk + 5) 50 20000 40
  if ($cVal -lt 0) { return $out }
  $seq = 0; $blank = 0
  for ($r = $r0 + 1; $r -lt $m.Count; $r++) {
    $rowNorm = Normalize-Ascii ($m[$r] -join ' ')
    if ($rowNorm -match '(?<![A-Z])TOTAL') { break }
    $val = To-Num (Cell $m $r $cVal)
    if ($null -eq $val) { $blank++; if ($blank -ge 5) { break } else { continue } }
    $blank = 0; $seq++
    $iso = $null; for ($c = [math]::Max(0, $cMk); $c -le $cVal; $c++) { if (Is-Date (Cell $m $r $c)) { $iso = To-Iso (Cell $m $r $c); break } }
    $desc = (Cell $m $r ($cVal + 1)).Trim(); if ($desc -eq '' -or $desc -eq '-') { $desc = (Cell $m $r ($cVal + 2)).Trim() }
    $out.Add([ordered]@{ order = $seq; date = $iso; value = $val; description = $desc })
    if ($out.Count -ge 120) { break }
  }
  return $out
}

# ---- Medições (valor numa janela ao redor do marcador; linha Terreno desloca 1 col) ----
function Extract-Measurements($m) {
  $out = New-Object System.Collections.Generic.List[object]
  $mk = Find-Marker $m '^MEDICAO' 4
  if ($null -eq $mk) { $mk = Find-Marker $m '^MEDICAO' }
  if ($null -eq $mk) { $mk = Find-Marker $m '^TERRENO$' 6 }  # fallback: tabela sem rótulo "MEDIÇÃO"
  if ($null -eq $mk) { return $out }
  $r0 = $mk[0]; $cMk = $mk[1]; $seq = 0; $blank = 0
  # se o marcador é "TERRENO" (valor na mesma linha), começa nela
  if ((Normalize-Ascii (Cell $m $r0 $cMk)) -match '^TERRENO$') { $r0 = $r0 - 1 }
  for ($r = $r0 + 1; $r -lt $m.Count; $r++) {
    $rowNorm = Normalize-Ascii ($m[$r] -join ' ')
    if ($rowNorm -match '(?<![A-Z])TOTAL') { break }
    $best = $null; $iso = $null
    for ($c = [math]::Max(0, $cMk - 2); $c -le $cMk + 2; $c++) {
      $cell = Cell $m $r $c
      if (Is-Date $cell) { $iso = To-Iso $cell }
      $n = To-Num $cell
      if ($null -ne $n -and $n -ge 5000 -and $n -le 200000) { if ($null -eq $best -or $n -gt $best) { $best = $n } }
    }
    if ($null -eq $best) { $blank++; if ($blank -ge 2) { break } else { continue } }
    $blank = 0; $seq++
    $type = if ($rowNorm -match 'TERRENO') { 'Terreno' } else { 'Medi' + [char]0x00E7 + [char]0x00E3 + 'o' }
    $out.Add([ordered]@{ order = $seq; type = $type; value = $best; date = $iso })
    if ($out.Count -ge 12) { break }
  }
  return $out
}

# ---- Orçamento previsto (bloco TOTAL OBRA / PREVISÃO) ----
function Extract-Budget($matrices) {
  $maoLbl = 'M' + [char]0x00E3 + 'o de obra'; $docLbl = 'Documenta' + [char]0x00E7 + [char]0x00E3 + 'o'
  $cats = @(@('Corretagem', 'CORRETAGEM'), @($maoLbl, 'MAO DE OBRA'), @($docLbl, 'DOCUMENTACAO'), @('Material', 'MATERIAL'), @('Terreno', 'TERRENO'))
  foreach ($m in $matrices) {
    $mk = Find-Marker $m 'TOTAL OBRA|^PREVISAO'
    if ($null -eq $mk) { continue }
    $r0 = $mk[0]; $c0 = $mk[1]
    $out = New-Object System.Collections.Generic.List[object]
    for ($r = $r0; $r -lt [math]::Min($r0 + 16, $m.Count); $r++) {
      foreach ($pair in $cats) {
        $label = $pair[0]; $pat = $pair[1]
        if ($out | Where-Object { $_.category -eq $label }) { continue }
        for ($c = [math]::Max(0, $c0 - 1); $c -le $c0 + 2; $c++) {
          if ((Normalize-Ascii (Cell $m $r $c)) -match $pat) {
            for ($cc = $c + 1; $cc -le $c + 3; $cc++) { $n = To-Num (Cell $m $r $cc); if ($null -ne $n -and $n -ge 100 -and $n -le 200000) { $out.Add([ordered]@{ category = $label; value = $n }); break } }
          }
        }
      }
    }
    if ($out.Count -ge 3) { return $out }
  }
  return (New-Object System.Collections.Generic.List[object])
}

# ---- Cerâmica (tabela lateral); valida que a 2ª coluna é metragem (ex.: "18M") ----
function Extract-Ceramics($matrices) {
  foreach ($m in $matrices) {
    for ($r0 = 0; $r0 -lt $m.Count; $r0++) {
      $row = $m[$r0]
      for ($c0 = 6; $c0 -lt $row.Count; $c0++) {
        if ((Normalize-Ascii $row[$c0]) -ne 'CERAMICA') { continue }
        # valida 1ª linha de dados: size com dígito + M
        $firstSize = Normalize-Ascii (Cell $m ($r0 + 1) ($c0 + 1))
        if ($firstSize -notmatch '^\d[\d,\.]*\s*M') { continue }
        $out = New-Object System.Collections.Generic.List[object]
        for ($r = $r0 + 1; $r -lt $m.Count; $r++) {
          $area = (Cell $m $r $c0).Trim(); $size = (Cell $m $r ($c0 + 1)).Trim(); $type = (Cell $m $r ($c0 + 2)).Trim()
          if ($area -eq '') { break }
          $out.Add([ordered]@{ area = $area; size = $size; type = $type })
          if ($out.Count -ge 20) { break }
        }
        if ($out.Count -ge 1) { return $out }
      }
    }
  }
  return (New-Object System.Collections.Generic.List[object])
}

# ---- Extras do cliente (marcador ADICIONAL ... CLIENTE) ----
function Extract-ClientExtras($matrices) {
  foreach ($m in $matrices) {
    $mk = Find-Marker $m 'ADI?CIONAL.*CLIENTE|ADICIONAL CLIENTE|OBRA ADICIONAL CLIENTE'
    if ($null -eq $mk) { continue }
    $r0 = $mk[0]; $c0 = $mk[1]; $out = New-Object System.Collections.Generic.List[object]
    $cVal = Best-NumCol $m $r0 ($c0 - 1) ($c0 + 2) 10 20000 30
    if ($cVal -lt 0) { continue }
    $blank = 0
    for ($r = $r0 + 1; $r -lt $m.Count; $r++) {
      $rowNorm = Normalize-Ascii ($m[$r] -join ' '); if ($rowNorm -match '(?<![A-Z])TOTAL') { break }
      $val = To-Num (Cell $m $r $cVal)
      if ($null -eq $val) { $blank++; if ($blank -ge 3) { break } else { continue } }
      $blank = 0
      $name = (Cell $m $r ($cVal + 1)).Trim(); if ($name -eq '' -or $name -eq '-') { $name = (Cell $m $r ($cVal - 1)).Trim() }
      if ($name -eq '') { $name = 'Adicional' }
      $out.Add([ordered]@{ name = $name; value = $val })
      if ($out.Count -ge 40) { break }
    }
    if ($out.Count -ge 1) { return $out }
  }
  return (New-Object System.Collections.Generic.List[object])
}

function Parse-Project($ods, $name) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($ods)
  $entry = $zip.Entries | Where-Object { $_.FullName -eq 'content.xml' }
  $reader = New-Object System.IO.StreamReader($entry.Open()); $xml = $reader.ReadToEnd(); $reader.Close(); $zip.Dispose()
  $doc = New-Object System.Xml.XmlDocument; $doc.LoadXml($xml)
  $ns = New-Object System.Xml.XmlNamespaceManager -ArgumentList $doc.NameTable
  $ns.AddNamespace('table', 'urn:oasis:names:tc:opendocument:xmlns:table:1.0'); $ns.AddNamespace('text', 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'); $ns.AddNamespace('office', 'urn:oasis:names:tc:opendocument:xmlns:office:1.0')
  $docM = $null; $consM = $null; $all = @()
  foreach ($t in $doc.SelectNodes('//table:table', $ns)) {
    $nm = Normalize-Ascii $t.GetAttribute('table:name'); $mat = Build-Matrix $t $ns; $all += , $mat
    if ($nm -match 'DOCUMENTA') { $docM = $mat } elseif ($nm -match 'CONSTRU') { $consM = $mat }
  }

  $documentation = if ($docM) { Extract-Main $docM } else { @() }
  $materials = if ($consM) { Extract-Main $consM } else { @() }
  $labor = if ($consM) { Extract-Payments $consM 'PAGAMENTO M' 4 } else { @() }
  $extraLabor = if ($consM) { Extract-Payments $consM 'OBRA EXTRA' 8 } else { @() }
  $measurements = if ($docM) { Extract-Measurements $docM } else { @() }
  $budget = Extract-Budget $all
  $ceramics = Extract-Ceramics $all
  $clientExtras = Extract-ClientExtras $all

  $codeNum = ''; $mm = [regex]::Match($name, '^\s*(\d+)'); if ($mm.Success) { $codeNum = $mm.Groups[1].Value + [char]0x00AA + ' Casa' }

  return [ordered]@{
    name            = $name
    project         = [ordered]@{ name = $name; code = $codeNum; dimensions = ''; budget = 140000; investment = 0 }
    documentation   = @($documentation)
    materials       = @($materials)
    labor           = @($labor)
    extraLabor      = @($extraLabor)
    clientExtras    = @($clientExtras)
    measurements    = @($measurements)
    budgetBreakdown = @($budget)
    ceramics        = @($ceramics)
  }
}

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projects = @()
foreach ($f in Get-ChildItem -LiteralPath $dir -Filter *.ods | Sort-Object Name) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
  $p = Parse-Project $f.FullName $name
  $projects += $p
  Write-Host ("{0,-24} doc={1,3} mat={2,3} lab={3,3} xlab={4,3} med={5,2} bud={6} cer={7,2} cli={8,2}" -f `
      $name, $p.documentation.Count, $p.materials.Count, $p.labor.Count, $p.extraLabor.Count, $p.measurements.Count, $p.budgetBreakdown.Count, $p.ceramics.Count, $p.clientExtras.Count)
}
$outDir = Join-Path (Split-Path -Parent $dir) 'lib\data'
$json = $projects | ConvertTo-Json -Depth 12 -Compress
[System.IO.File]::WriteAllText((Join-Path $outDir 'imported-projects.json'), $json, (New-Object System.Text.UTF8Encoding($false)))
"WROTE $($projects.Count) projects ($([math]::Round($json.Length/1024,1)) KB)"
