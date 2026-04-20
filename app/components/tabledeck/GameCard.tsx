import type { ReactNode } from "react";

interface GameCardProps {
  children: ReactNode;
  live?: boolean;
  href?: string;
  className?: string;
}

export function GameCard({ children, live = false, href, className = "" }: GameCardProps) {
  const cls = `td-card ${live ? "live" : "preview"} ${className}`;

  if (live && href) {
    return (
      <a href={href} className={cls} style={{ display: "block", textDecoration: "none" }}>
        {children}
      </a>
    );
  }

  return (
    <div className={cls}>
      {children}
    </div>
  );
}
