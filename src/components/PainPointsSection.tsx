import { Clock, UserX, Calendar, Frown } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "No Time to Clean",
    description: "Between work and family, who has hours to scrub floors?",
  },
  {
    icon: UserX,
    title: "Unreliable Helpers",
    description: "Tired of no-shows and inconsistent quality?",
  },
  {
    icon: Calendar,
    title: "Scheduling Headaches",
    description: "Phone tag and missed appointments waste your time.",
  },
  {
    icon: Frown,
    title: "Trust Concerns",
    description: "Letting strangers into your home feels risky.",
  },
];

const PainPointsSection = () => {
  return (
    <section className="section-alt section-padding">
      <div className="container-tight px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            We Get It. Life Is Busy.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You shouldn't have to choose between a clean home and your precious free time.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-background rounded-lg p-5 border border-border text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                {point.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
