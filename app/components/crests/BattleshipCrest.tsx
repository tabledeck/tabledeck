interface BattleshipCrestProps {
  size?: number;
  className?: string;
}

export function BattleshipCrest({ size = 48, className = "" }: BattleshipCrestProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Battleship"
    >
      {/* Battleship silhouette — inked navy on cream, Hasbro-profile style */}
      {/* hull */}
      <path
        d="M4 34 L6 30 L8 30 L8 26 L10 26 L10 22 L14 22 L14 18 L20 18 L20 16 L28 16 L28 18 L34 18 L34 22 L38 22 L40 24 L42 28 L42 30 L44 30 L44 34 Z"
        fill="#0f1d33"
        stroke="#0f1d33"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* superstructure */}
      <path
        d="M16 18 L16 14 L18 12 L30 12 L32 14 L32 18"
        fill="#17294b"
        stroke="#0f1d33"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* main gun turret */}
      <rect x="20" y="10" width="10" height="4" rx="1" fill="#0f1d33" />
      {/* gun barrel */}
      <rect x="24" y="6" width="2" height="6" rx="1" fill="#0f1d33" />
      {/* rivet row on hull */}
      <g fill="#f4e9d0">
        <circle cx="10" cy="31" r="1.2" />
        <circle cx="16" cy="31" r="1.2" />
        <circle cx="22" cy="31" r="1.2" />
        <circle cx="28" cy="31" r="1.2" />
        <circle cx="34" cy="31" r="1.2" />
        <circle cx="40" cy="31" r="1.2" />
      </g>
      {/* waterline */}
      <path
        d="M4 34 Q12 36 24 35 Q36 34 44 34"
        fill="none"
        stroke="#0f1d33"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
