import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-background overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Clean, bright living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-tight section-padding">
        <div className="max-w-xl py-8 md:py-12 lg:py-16 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background leading-tight mb-4">
            Come Home to a Spotless House
          </h1>
          <p className="text-lg md:text-xl text-background/90 mb-6 leading-relaxed">
            Professional cleaning services for busy families in your area. 
            Book online in under 60 seconds.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-background/90 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Vetted Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-background/90 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-background/90 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Flexible Scheduling</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl">
              Book a Cleaning
            </Button>
            <Button variant="outline-light" size="xl">
              View Services
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-background/80">
              <span className="font-semibold text-background">2,500+</span> happy homes cleaned this month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
