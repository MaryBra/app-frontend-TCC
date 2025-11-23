export function PerfilAcademicoSectionLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 mt-6">
      {children}
    </section>
  );
}
