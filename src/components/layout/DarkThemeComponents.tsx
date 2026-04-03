import React from 'react';

interface DarkThemeWrapperProps {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const DarkThemeWrapper: React.FC<DarkThemeWrapperProps> = ({
  children,
  centered = false,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full
        min-h-auto
        bg-gradient-to-br
        from-obsidian-void
        via-obsidian-navy
        to-obsidian-void
        ${centered ? 'flex justify-center items-center' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #05070A 0%, #0F172A 50%, #05070A 100%)',
      }}
    >
      <div
        className={`
          w-full
          px-4
          py-8
          md:px-8
          md:py-12
        `}
      >
        {children}
      </div>
    </div>
  );
};

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hoverable = true,
}) => {
  return (
    <div
      className={`
        w-full
        rounded-2xl
        p-6
        md:p-8
        transition-all
        duration-300
        border
        backdrop-blur-xl
        ${hoverable 
          ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-opacity-100' 
          : ''
        }
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderColor: 'var(--obsidian-border)',
        boxShadow: 'var(--obsidian-shadow-lg)',
      }}
    >
      {children}
    </div>
  );
};

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  subtitle,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-8 md:mb-12 ${className}`}>
      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{
          color: 'var(--obsidian-text-primary)',
          textShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
        }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className="text-lg"
          style={{
            color: 'var(--obsidian-text-secondary)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const baseStyles = `
    rounded-lg
    font-semibold
    transition-all
    duration-200
    cursor-pointer
    border
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: `
      bg-obsidian-blue
      text-white
      border-transparent
      hover:bg-blue-600
      shadow-lg
      shadow-blue-500/20
    `,
    secondary: `
      bg-transparent
      text-obsidian-text-secondary
      border-obsidian-border
      hover:border-obsidian-blue
      hover:text-obsidian-blue
    `,
    accent: `
      bg-gradient-to-r
      from-obsidian-blue
      to-obsidian-info
      text-white
      border-transparent
      hover:shadow-xl
      hover:shadow-blue-500/30
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--obsidian-blue)' : undefined,
        borderColor: variant === 'secondary' ? 'var(--obsidian-border)' : undefined,
        color: variant === 'primary' ? 'white' : 'var(--obsidian-text-secondary)',
      }}
    >
      {children}
    </button>
  );
};

interface GridProps {
  children: React.ReactNode;
  cols?: number;
  gap?: string;
  className?: string;
}

export const ModernGrid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = '1.5rem',
  className = '',
}) => {
  return (
    <div
      className={`
        grid
        w-full
        auto-rows-auto
        ${className}
      `}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
};

