import { PropsWithChildren } from 'react';

export type ButtonProps = PropsWithChildren & {
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button = ({ children, disabled, onClick }: ButtonProps) => {
  return (
    <button
      style={{
        background: '#0087fe',
        color: 'white',
        fontSize: '14px',
        outline: 0,
        border: 0,
      }}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
