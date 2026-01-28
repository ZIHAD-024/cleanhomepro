import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-tight">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground">CleanHome Pro</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            <button
              onClick={() => navigate("/auth")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </button>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+1234567890" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="w-4 h-4" />
              (123) 456-7890
            </a>
            <Button variant="cta" size="default" onClick={() => navigate("/booking")}>
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 px-4 bg-background">
            <nav className="flex flex-col gap-3">
              <a href="#services" className="text-sm font-medium text-foreground py-2">
                Services
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-foreground py-2">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-foreground py-2">
                Reviews
              </a>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium text-foreground py-2 text-left"
              >
                Admin Login
              </button>
              <div className="pt-3 border-t border-border mt-2">
                <a href="tel:+1234567890" className="flex items-center gap-2 text-sm font-medium text-foreground py-2">
                  <Phone className="w-4 h-4" />
                  (123) 456-7890
                </a>
                <Button variant="cta" size="lg" className="w-full mt-3" onClick={() => navigate("/booking")}>
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
