import React from 'react';

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  className?: string;
  centered?: boolean;
}

export const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  maxWidth = '1200px',
  padding = '2rem',
  className = '',
  centered = false,
}) => {
  return (
    <div
      className={`w-full ${centered ? 'flex justify-center items-start' : ''} ${className}`}
      style={{
        minHeight: 'auto',
        paddingLeft: padding,
        paddingRight: padding,
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: centered ? maxWidth : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface CenteredCardProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const CenteredCard: React.FC<CenteredCardProps> = ({
  children,
  className = '',
  centered = true,
}) => {
  return (
    <div
      className={`
        ${centered ? 'w-full flex justify-center items-center' : ''}
        ${className}
      `}
    >
      <div
        className="
          bg-gradient-to-br from-obsidian-navy to-obsidian-slate
          border border-obsidian-border
          rounded-xl
          p-6
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-200
          max-w-full
        "
        style={{
          backgroundColor: 'var(--obsidian-navy)',
          borderColor: 'var(--obsidian-border)',
          boxShadow: 'var(--obsidian-shadow-md)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface CenteredContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full
        flex
        flex-col
        items-center
        justify-center
        gap-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

