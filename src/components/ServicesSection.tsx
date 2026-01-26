import { Button } from "@/components/ui/button";
import { Home, Sparkles, Building, Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: "regular",
    icon: Home,
    title: "Standard Cleaning",
    description: "Regular maintenance cleaning for bedrooms, living areas, kitchen, and bathrooms.",
    price: "From $89",
    duration: "2-3 hours",
  },
  {
    id: "deep",
    icon: Sparkles,
    title: "Deep Cleaning",
    description: "Thorough top-to-bottom cleaning including inside appliances, baseboards, and hard-to-reach areas.",
    price: "From $149",
    duration: "4-5 hours",
  },
  {
    id: "move",
    icon: Building,
    title: "Move In/Out Cleaning",
    description: "Complete cleaning service for empty homes. Perfect for new tenants or before handover.",
    price: "From $199",
    duration: "5-7 hours",
  },
  {
    id: "office",
    icon: Wrench,
    title: "Maintenance Services",
    description: "Minor home repairs and maintenance tasks handled by our trusted professionals.",
    price: "From $59",
    duration: "Varies",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();
  
  const handleBookService = (serviceId: string) => {
    navigate(`/booking?service=${serviceId}`);
  };

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container-tight px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the cleaning package that fits your needs. All services include 
            our satisfaction guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-lg border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {service.title}
                    </h3>
                    <span className="text-accent font-bold text-lg">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {service.duration}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary"
                      onClick={() => handleBookService(service.id)}
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
