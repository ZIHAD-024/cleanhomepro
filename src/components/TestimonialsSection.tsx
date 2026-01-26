import { Star, Quote, Shield, Award, Clock } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Downtown",
    text: "Finally found a cleaning service I can rely on. They show up on time, do excellent work, and I love being able to book online.",
    rating: 5,
  },
  {
    name: "David L.",
    location: "Suburbs",
    text: "Been using them for 6 months now. My wife and I both work long hours, and coming home to a clean house on Fridays is amazing.",
    rating: 5,
  },
  {
    name: "Maria G.",
    location: "Midtown",
    text: "The deep cleaning before we moved in was thorough. Every corner spotless. Worth every penny.",
    rating: 5,
  },
];

const trustSignals = [
  {
    icon: Shield,
    title: "Background Checked",
    description: "All staff verified and vetted",
  },
  {
    icon: Award,
    title: "Trained Professionals",
    description: "Certified cleaning experts",
  },
  {
    icon: Clock,
    title: "100% Satisfaction",
    description: "We'll make it right, guaranteed",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="container-tight px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Trusted by Your Neighbors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thousands of families in your area already trust us with their homes.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border p-6"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-semibold text-foreground text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="bg-section-alt rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {trustSignals.map((signal, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <signal.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                  {signal.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
