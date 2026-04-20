import type { ReactNode } from "react";

interface BtnPrimaryProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function BtnPrimary({ href, onClick, children, className = "", disabled }: BtnPrimaryProps) {
  if (href) {
    return (
      <a href={href} className={`td-btn-primary ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`td-btn-primary ${className}`}>
      {children}
    </button>
  );
}
