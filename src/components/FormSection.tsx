
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const FormSection = ({ children, index, className }: FormSectionProps) => {
  return (
    <Card 
      className={cn(
        "form-section mb-8 overflow-hidden transition-all duration-300 hover:shadow-md", 
        className
      )}
      style={{ '--delay': index } as React.CSSProperties}
    >
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
