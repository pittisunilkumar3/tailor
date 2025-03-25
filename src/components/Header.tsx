
import React from 'react';
import { Baby } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-8 mb-8">
      <div className="text-center opacity-0 animate-slide-in-up" style={{ '--delay': 0 } as React.CSSProperties}>
        <div className="flex items-center justify-center mb-2">
          <Baby className="text-primary mr-2 h-5 w-5" />
          <p className="text-sm tracking-widest uppercase text-muted-foreground">Children's Precision Tailoring</p>
        </div>
        <h1 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
          Child Measurement Form
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-sm md:text-base">
          Please provide accurate measurements for your child's custom tailored garments. All measurements should be in inches.
        </p>
      </div>
    </header>
  );
};

export default Header;
