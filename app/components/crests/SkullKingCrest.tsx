interface SkullKingCrestProps {
  size?: number;
  className?: string;
}

export function SkullKingCrest({ size = 48, className = "" }: SkullKingCrestProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Skull King"
    >
      <defs>
        <radialGradient id="sk-gold-rg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e8c872" />
          <stop offset="55%" stopColor="#c9a24a" />
          <stop offset="100%" stopColor="#7f5a17" />
        </radialGradient>
      </defs>
      {/* crossed cutlasses */}
      <g stroke="url(#sk-gold-rg)" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <line x1="10" y1="12" x2="54" y2="56" />
        <line x1="54" y1="12" x2="10" y2="56" />
        <circle cx="10" cy="12" r="2.5" fill="url(#sk-gold-rg)" stroke="none" />
        <circle cx="54" cy="12" r="2.5" fill="url(#sk-gold-rg)" stroke="none" />
      </g>
      {/* skull */}
      <path
        d="M32 18c-10 0-16 7-16 15 0 4 2 7 4 9v4c0 2 1 3 3 3h3v-3h2v3h8v-3h2v3h3c2 0 3-1 3-3v-4c2-2 4-5 4-9 0-8-6-15-16-15z"
        fill="#f4e9d0"
        stroke="#1a1612"
        strokeWidth="1.4"
      />
      <circle cx="26" cy="34" r="3.2" fill="#1a1612" />
      <circle cx="38" cy="34" r="3.2" fill="#1a1612" />
      <path
        d="M29 42c1 1.5 2 2.5 3 2.5s2-1 3-2.5"
        stroke="#1a1612"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M30 46l-1 3M32 46v3M34 46l1 3"
        stroke="#1a1612"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
