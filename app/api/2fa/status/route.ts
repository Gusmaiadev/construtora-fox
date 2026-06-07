import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken, readTrust, TRUST_COOKIE } from '@/lib/server/twofa';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const user = await verifyFirebaseToken(idToken);
    const trustUid = await readTrust(req.cookies.get(TRUST_COOKIE)?.value);
    return NextResponse.json({ trusted: trustUid === user.uid });
  } catch {
    return NextResponse.json({ trusted: false });
  }
}
