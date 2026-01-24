export default function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" | "xlarge" }) {
  const sizes = {
    small: "h-8",
    default: "h-[80px]",
    large: "h-16",
    xlarge: "h-48"
  };

  return (
    <img
      src="/central_oregon_logo_new_design_(1)_(2).png"
      alt="Central Oregon Brush & Weed Eaters"
      className={`${sizes[size]} w-auto ${className}`}
    />
  );
}
