import type { ReactNode } from "react";

interface BtnSecondaryProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function BtnSecondary({ href, onClick, children, className = "", disabled }: BtnSecondaryProps) {
  if (href) {
    return (
      <a href={href} className={`td-btn-secondary ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`td-btn-secondary ${className}`}>
      {children}
    </button>
  );
}
