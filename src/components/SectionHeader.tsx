
import React from 'react';
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, className, icon }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-6 border-l-4 border-primary pl-3", className)}>
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
