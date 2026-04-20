interface KingsCribbageCrestProps {
  size?: number;
  className?: string;
}

export function KingsCribbageCrest({ size = 48, className = "" }: KingsCribbageCrestProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="King's Cribbage"
    >
      <defs>
        <radialGradient id="kc-gold" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e8c872" />
          <stop offset="55%" stopColor="#c9a24a" />
          <stop offset="100%" stopColor="#7f5a17" />
        </radialGradient>
      </defs>
      {/* walnut shield */}
      <path
        d="M12 10h40v22c0 12-10 20-20 24-10-4-20-12-20-24z"
        fill="#6b1a21"
        stroke="#3a2416"
        strokeWidth="1.8"
      />
      {/* gold crown */}
      <path
        d="M14 10l4-8 6 4 4-8 4 8 6-4 4 8z"
        fill="url(#kc-gold)"
        stroke="#6b1a21"
        strokeWidth="1.2"
      />
      <circle cx="22" cy="4" r="1.5" fill="#6b1a21" />
      <circle cx="42" cy="4" r="1.5" fill="#6b1a21" />
      {/* gold suit marks inside shield */}
      <g fill="url(#kc-gold)">
        {/* heart */}
        <path d="M22 22c0-2 1-3 3-3s3 1 3 3-2 3-3 5c-1-2-3-3-3-5z" />
        {/* spade */}
        <path d="M38 22c0-2 1-3 3-3s3 1 3 3-2 3-3 5c-1-2-3-3-3-5z" />
        {/* diamond */}
        <path d="M32 38l-4-6 2-2 2 2 2-2 2 2z" />
      </g>
    </svg>
  );
}
