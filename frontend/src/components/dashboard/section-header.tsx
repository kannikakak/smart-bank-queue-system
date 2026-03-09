type SectionHeaderProps = {
  title: string;
  description: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
