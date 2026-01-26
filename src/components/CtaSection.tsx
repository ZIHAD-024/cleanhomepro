import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="section-dark section-padding">
      <div className="container-tight px-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-section-dark-foreground mb-4">
          Ready for a Cleaner Home?
        </h2>
        <p className="text-section-dark-foreground/80 max-w-xl mx-auto mb-8 text-lg">
          Schedule your first cleaning today. No contracts, no hassle. 
          Just a spotless home waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button variant="hero" size="xl" className="w-full sm:w-auto">
            Book Your Cleaning
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline-light" size="xl" className="w-full sm:w-auto">
            <Phone className="w-5 h-5 mr-2" />
            (123) 456-7890
          </Button>
        </div>

        <p className="text-section-dark-foreground/60 text-sm">
          Most bookings confirmed within 30 minutes • Same-day appointments often available
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
