interface GameOfThingsCrestProps {
  size?: number;
  className?: string;
}

export function GameOfThingsCrest({ size = 48, className = "" }: GameOfThingsCrestProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Game of Things"
    >
      {/* rubber-stamp circle — speakeasy coaster style */}
      {/* outer stamp ring */}
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="#a3441e"
        strokeWidth="2.5"
        strokeDasharray="3 2"
      />
      {/* inner ring */}
      <circle
        cx="24"
        cy="24"
        r="17"
        fill="none"
        stroke="#a3441e"
        strokeWidth="1"
      />
      {/* cocktail glass silhouette */}
      <path
        d="M18 12 L30 12 L26 20 L26 30 L28 32 L20 32 L22 30 L22 20 Z"
        fill="#a3441e"
        stroke="none"
      />
      {/* glass rim highlight */}
      <line x1="18" y1="12" x2="30" y2="12" stroke="#c9a24a" strokeWidth="1.5" strokeLinecap="round" />
      {/* "THINGS" text around the bottom arc — two curved text segments */}
      <text
        x="50%"
        y="42"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontWeight="700"
        fontSize="6"
        letterSpacing="0.3em"
        fill="#a3441e"
      >
        THINGS
      </text>
      {/* top label */}
      <text
        x="50%"
        y="11"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontWeight="500"
        fontSize="4.5"
        letterSpacing="0.25em"
        fill="#a3441e"
      >
        GAME OF
      </text>
    </svg>
  );
}
