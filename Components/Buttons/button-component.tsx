import React from "react";

export type ButtonProps = {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  type = "button",
  onClick,
  disabled = false,
}) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
