
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  unit?: string;
  error?: string;
}

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className,
  min,
  max,
  unit,
  error
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2 relative", className)}>
      <div className="flex justify-between items-baseline">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {unit && (
          <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-gray-100 rounded-full">{unit}</span>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className={cn(
            "w-full transition-all duration-200 focus:ring-2 focus:ring-offset-0",
            error 
              ? "border-destructive focus:ring-destructive/25 pr-10" 
              : "focus:ring-primary/25 focus:border-primary"
          )}
          aria-invalid={!!error}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1 animate-fade-in group">
          <AlertCircle className="h-3 w-3 inline-block mr-1" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
