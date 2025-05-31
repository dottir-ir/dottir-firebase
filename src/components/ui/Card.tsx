import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'elevated',
  className = '',
  onClick,
}) => {
  const { theme } = useTheme();

  const variantStyles = {
    elevated: `
      bg-${theme.colors.background}
      shadow-lg
    `,
    outlined: `
      bg-${theme.colors.background}
      border border-gray-200
    `,
    filled: `
      bg-${theme.colors.surface}
    `,
  };

  return (
    <div
      className={`
        rounded-lg overflow-hidden
        ${variantStyles[variant]}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {(header || title) && (
        <CardHeader>
          {header || (
            <>
              {title && (
                <h3
                  className={`
                    text-lg font-medium
                    text-${theme.colors.text}
                  `}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className={`
                    mt-1 text-sm
                    text-${theme.colors.secondary}
                  `}
                >
                  {subtitle}
                </p>
              )}
            </>
          )}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`
        px-6 py-4
        border-b border-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`
        px-6 py-4
        border-t border-gray-200
        bg-${theme.colors.surface}
        ${className}
      `}
    >
      {children}
    </div>
  );
}; 