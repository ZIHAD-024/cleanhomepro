import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, MessageCircle, ArrowRight, Home, CalendarPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  // Redirect if no booking data
  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

  const { bookingId, service, date, time, customer } = booking;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const nextSteps = [
    {
      step: 1,
      title: "Booking Review",
      description: "Our team reviews your booking and confirms availability",
    },
    {
      step: 2,
      title: "Confirmation Sent",
      description: "You'll receive SMS and email confirmation within 30 minutes",
    },
    {
      step: 3,
      title: "Service Day",
      description: "Our verified staff arrives at your scheduled time",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Confirmation Header */}
        <section className="bg-section-alt border-b border-border py-10 px-4">
          <div className="container-tight max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Booking Is Confirmed
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Thank you. We've received your booking and will contact you shortly to confirm the details.
            </p>
          </div>
        </section>

        <div className="container-tight max-w-3xl mx-auto py-8 px-4 space-y-6">
          {/* Booking Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Booking Details</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ID: {bookingId}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Service
                    </p>
                    <p className="font-semibold text-foreground">
                      {service?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Date & Time
                    </p>
                    <p className="font-medium text-foreground">{formattedDate}</p>
                    <p className="text-foreground">{time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Duration
                    </p>
                    <p className="text-foreground">{service?.duration}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Customer
                    </p>
                    <p className="font-medium text-foreground">
                      {customer?.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer?.phone}
                    </p>
                    {customer?.email && (
                      <p className="text-sm text-muted-foreground">
                        {customer?.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Service Address
                    </p>
                    <p className="text-foreground">{customer?.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Status
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      Pending Confirmation
                    </span>
                  </div>
                </div>
              </div>

              {customer?.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Additional Notes
                  </p>
                  <p className="text-foreground">{customer.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Estimated Price
                </p>
                <p className="text-xl font-bold text-foreground">
                  {service?.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  Final price will be confirmed after property assessment
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">What Happens Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((item, index) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {item.step}
                      </div>
                      {index < nextSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support & Contact */}
          <Card className="bg-section-alt border-border">
            <CardContent className="py-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">
                  Need to change or cancel?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact us anytime. We're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-foreground font-medium text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    (123) 456-7890
                  </a>
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-foreground font-medium text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate("/booking")}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Book Another Service
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
