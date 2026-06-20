interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand-red to-brand-red-light py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        <div className="gold-divider" />
        {subtitle && <p className="mx-auto max-w-2xl text-lg text-white/90">{subtitle}</p>}
      </div>
    </div>
  );
}
