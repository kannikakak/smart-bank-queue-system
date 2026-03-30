type PortalSectionHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  variant?: "process" | "services" | "support";
};

export function PortalSectionHeader({
  kicker,
  title,
  description,
  variant = "services",
}: PortalSectionHeaderProps) {
  const kickerClassName =
    variant === "process" ? "portal-process-kicker" : "portal-services-kicker";
  const wrapperClassName =
    variant === "process"
      ? "portal-process-header"
      : variant === "support"
        ? "portal-support-header"
        : "portal-services-header";

  return (
    <div className={wrapperClassName}>
      <p className={kickerClassName}>{kicker}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
