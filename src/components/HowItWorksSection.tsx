import { MousePointerClick, CalendarCheck, ClipboardCheck, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    step: "1",
    title: "Choose Your Service",
    description: "Select the cleaning type that fits your home and needs.",
  },
  {
    icon: CalendarCheck,
    step: "2",
    title: "Pick a Date & Time",
    description: "Choose a slot that works for you. We're flexible.",
  },
  {
    icon: ClipboardCheck,
    step: "3",
    title: "Confirm Details",
    description: "Add your address and any special instructions.",
  },
  {
    icon: ThumbsUp,
    step: "4",
    title: "Relax & Enjoy",
    description: "Our vetted pros arrive on time and do the work.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-alt section-padding">
      <div className="container-tight px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Booking a cleaning takes less than 60 seconds. Here's how simple it is.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector line (hidden on mobile, visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-border" />
              )}
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-primary-foreground font-bold text-lg">{step.step}</span>
                </div>
              </div>
              <step.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
