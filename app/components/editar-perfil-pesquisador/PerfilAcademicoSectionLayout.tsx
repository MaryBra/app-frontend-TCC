export function PerfilAcademicoSectionLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 mt-6">
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
      {children}
    </section>
  );
}
