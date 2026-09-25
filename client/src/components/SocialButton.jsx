/**
 * SocialButton — EXACT CodePen NeQZGx effect by Ephraim Sangma
 * White circle, color fills from bottom on hover, icon rotates 360 degrees
 */
export const SocialButton = ({
  href,
  icon,
  label,
  platform = "",
  size = "md",
  onClick,
  disabled = false,
}) => {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const platformClass = platform ? `btn-${platform}` : "";
  const className = `social-btn-codepen ${platformClass} ${sizeClass}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
        title={label}
      >
        <span className="social-icon">{icon}</span>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={label}
      title={label}
      style={disabled ? { opacity: 0.4, pointerEvents: "none" } : {}}
    >
      <span className="social-icon">{icon}</span>
    </button>
  );
};

export default SocialButton;
