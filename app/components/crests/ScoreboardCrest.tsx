interface ScoreboardCrestProps {
  size?: number;
  className?: string;
}

export function ScoreboardCrest({ size = 48, className = "" }: ScoreboardCrestProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Scoreboard"
    >
      <defs>
        <radialGradient id="sb-gold" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8c872" />
          <stop offset="55%" stopColor="#c9a24a" />
          <stop offset="100%" stopColor="#7f5a17" />
        </radialGradient>
        <linearGradient id="sb-bone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#faf3e3" />
          <stop offset="100%" stopColor="#e2d4b0" />
        </linearGradient>
      </defs>

      {/* walnut tablet frame */}
      <rect
        x="8"
        y="10"
        width="48"
        height="44"
        rx="3"
        fill="#3a2416"
        stroke="#2a1a10"
        strokeWidth="1.2"
      />

      {/* bone ledger page */}
      <rect
        x="11"
        y="13"
        width="42"
        height="38"
        rx="1.5"
        fill="url(#sb-bone)"
        stroke="#c0b087"
        strokeWidth="0.6"
      />

      {/* gold top rule */}
      <rect x="13" y="17" width="38" height="1.2" fill="url(#sb-gold)" />

      {/* gold crown medallion (leader marker) */}
      <g transform="translate(32,13)">
        <circle r="4.5" fill="url(#sb-gold)" stroke="#3a2416" strokeWidth="0.6" />
        <path
          d="M-2.4,-0.6 L-1.4,-2 L-0.5,-0.4 L0.5,-2 L1.4,-0.4 L2.4,-2 L2.4,1 L-2.4,1 Z"
          fill="#3a2416"
        />
      </g>

      {/* ruled score rows — ascending bars, ledger aesthetic */}
      <g stroke="#1a1612" strokeWidth="0.6" strokeLinecap="round" opacity="0.75">
        <line x1="14" y1="26" x2="32" y2="26" />
        <line x1="14" y1="32" x2="40" y2="32" />
        <line x1="14" y1="38" x2="36" y2="38" />
        <line x1="14" y1="44" x2="44" y2="44" />
      </g>

      {/* tabular score dots on the right (Plex Mono reference) */}
      <g fill="#3a2f25">
        <circle cx="46" cy="26" r="1.1" />
        <circle cx="46" cy="32" r="1.1" />
        <circle cx="46" cy="38" r="1.1" />
        <circle cx="46" cy="44" r="1.1" />
      </g>

      {/* quill / pencil stroke diagonal accent */}
      <line
        x1="40"
        y1="50"
        x2="52"
        y2="38"
        stroke="#c9a24a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="50" r="1.2" fill="#1a1612" />
    </svg>
  );
}
