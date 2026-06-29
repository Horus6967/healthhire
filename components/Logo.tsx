export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HealthHire logo"
    >
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8" fill="#0A66C2" />

      {/* Medical cross arms */}
      {/* Vertical bar */}
      <rect x="13" y="5" width="6" height="22" rx="2" fill="white" />
      {/* Horizontal bar */}
      <rect x="5" y="13" width="22" height="6" rx="2" fill="white" />

      {/* Checkmark overlay — bottom-right */}
      <circle cx="23" cy="23" r="7" fill="#16a34a" />
      <polyline
        points="19.5,23 22,25.5 26.5,20.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
