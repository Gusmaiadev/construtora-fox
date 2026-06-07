import { ProjectProvider } from '@/lib/store/ProjectContext';
import { AppShell } from '@/components/dashboard/layout/AppShell';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProjectProvider projectId={id}>
      <AppShell projectId={id}>{children}</AppShell>
    </ProjectProvider>
  );
}
