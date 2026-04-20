interface CardFanIconProps {
  size?: number;
  className?: string;
}

export function CardFanIcon({ size = 64, className = "" }: CardFanIconProps) {
  return (
    <svg
      viewBox="0 0 80 64"
      width={size}
      height={size * (64 / 80)}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cf-gold" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e8c872" />
          <stop offset="60%" stopColor="#c9a24a" />
          <stop offset="100%" stopColor="#8b6a1e" />
        </radialGradient>
      </defs>
      {/* left card — rotated -18deg */}
      <g transform="rotate(-18 40 56)">
        <rect x="16" y="12" width="32" height="48" rx="4"
          fill="#f4e9d0" stroke="#1a1612" strokeWidth="1" />
        <rect x="19" y="15" width="26" height="42" rx="2.5"
          fill="none" stroke="rgba(26,22,18,0.22)" strokeWidth="0.8" />
        <text x="20" y="25" fontFamily="Georgia,serif" fontWeight="700" fontSize="10" fill="#6b1a21">A</text>
      </g>
      {/* right card — rotated +18deg */}
      <g transform="rotate(18 40 56)">
        <rect x="32" y="12" width="32" height="48" rx="4"
          fill="#f4e9d0" stroke="#1a1612" strokeWidth="1" />
        <rect x="35" y="15" width="26" height="42" rx="2.5"
          fill="none" stroke="rgba(26,22,18,0.22)" strokeWidth="0.8" />
        <text x="36" y="25" fontFamily="Georgia,serif" fontWeight="700" fontSize="10" fill="#0f1d33">K</text>
      </g>
      {/* center card — upright */}
      <rect x="24" y="8" width="32" height="48" rx="4"
        fill="#f4e9d0" stroke="#1a1612" strokeWidth="1.2" />
      <rect x="27" y="11" width="26" height="42" rx="2.5"
        fill="none" stroke="rgba(26,22,18,0.22)" strokeWidth="0.8" />
      {/* center suit — gold star/skull placeholder */}
      <path
        d="M40 20 L42 26 L48 26 L43 30 L45 36 L40 32 L35 36 L37 30 L32 26 L38 26 Z"
        fill="url(#cf-gold)"
        stroke="none"
      />
      <text x="27" y="21" fontFamily="Georgia,serif" fontWeight="700" fontSize="9" fill="#1a1612">J</text>
    </svg>
  );
}
