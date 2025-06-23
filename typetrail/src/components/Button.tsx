import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  active,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`${styles.button} ${active ? styles.active : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
