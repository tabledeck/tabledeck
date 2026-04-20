import type { ReactNode } from "react";

interface BtnPrimaryProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export function BtnPrimary({ href, onClick, children, className = "", disabled, type = "button", fullWidth }: BtnPrimaryProps) {
  const widthStyle = fullWidth ? { width: "100%", justifyContent: "center" } : undefined;
  if (href) {
    return (
      <a href={href} className={`td-btn-primary ${className}`} style={widthStyle}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={`td-btn-primary ${className}`} style={widthStyle}>
      {children}
    </button>
  );
}
