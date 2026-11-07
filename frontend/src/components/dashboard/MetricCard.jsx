
export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}) {
  return (
    <div className={`metric-card ${accent ? "metric-card-accent" : ""}`}>
      <div className="metric-card-header">
        <span>{label}</span>
        {Icon && <Icon size={20} />}
      </div>
      <div className="metric-card-value">{value}</div>
      {description && (
        <p className="metric-card-description">{description}</p>
      )}
    </div>
  );
}