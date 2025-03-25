
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-primary/10 px-4 py-8">
      <div className="glass-panel rounded-lg p-8 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-6xl font-light mb-6">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We couldn't find the page you're looking for.
        </p>
        <Button 
          asChild
          className="bg-black text-white hover:bg-black/80 transition-all duration-300"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
