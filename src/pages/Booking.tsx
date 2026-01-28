import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  base_price: number | null;
}

// Fallback services for when DB is empty
const fallbackServices: Service[] = [
  {
    id: "regular",
    name: "Regular Cleaning",
    description: "Standard home cleaning for weekly or bi-weekly maintenance",
    duration_minutes: 150,
    base_price: 89,
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    description: "Thorough cleaning including hard-to-reach areas and appliances",
    duration_minutes: 270,
    base_price: 149,
  },
  {
    id: "move",
    name: "Move-In/Out Cleaning",
    description: "Complete cleaning for moving transitions, top to bottom",
    duration_minutes: 330,
    base_price: 199,
  },
];

const timeSlots = [
  { time: "08:00 AM", available: true },
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "11:00 AM", available: true },
  { time: "12:00 PM", available: true },
  { time: "01:00 PM", available: false },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "05:00 PM", available: false },
];

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service");
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<string>(
    preselectedService || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, description, duration_minutes, base_price")
        .eq("is_active", true)
        .order("base_price", { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(fallbackServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices(fallbackServices);
    } finally {
      setLoadingServices(false);
    }
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Varies";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hours`;
    return `${hours}-${hours + 1} hours`;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for quote";
    return `From $${price}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!selectedService) {
      newErrors.service = "Please select a service";
    }
    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }
    if (!selectedTime) {
      newErrors.time = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // First, create or find the customer
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .insert({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim(),
          source: "Website",
        })
        .select("id")
        .single();

      if (customerError) throw customerError;

      // Convert time string to 24h format for DB
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = parseInt(timeMatch?.[1] || "0");
      const minutes = timeMatch?.[2] || "00";
      const period = timeMatch?.[3]?.toUpperCase();
      
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      
      const bookingTime = `${hours.toString().padStart(2, "0")}:${minutes}:00`;

      // Create the booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          customer_id: customerData.id,
          service_id: selectedServiceData?.id || null,
          booking_date: selectedDate?.toISOString().split("T")[0],
          booking_time: bookingTime,
          notes: formData.notes.trim() || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (bookingError) throw bookingError;

      // Navigate to confirmation with booking details
      navigate("/booking/confirmation", {
        state: {
          bookingId: bookingData.id.slice(0, 8).toUpperCase(),
          service: selectedServiceData,
          date: selectedDate,
          time: selectedTime,
          customer: formData,
        },
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete =
    selectedService &&
    selectedDate &&
    selectedTime &&
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.address.trim();

  const currentStep = !selectedService
    ? 1
    : !selectedDate || !selectedTime
    ? 2
    : 3;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-section-alt border-b border-border py-8 px-4">
          <div className="container-tight max-w-5xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Book Your Service
            </h1>
            <p className="text-muted-foreground mt-2">
              Choose your service, preferred time, and confirm your booking.
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { step: 1, label: "Service" },
                { step: 2, label: "Schedule" },
                { step: 3, label: "Confirm" },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      currentStep >= item.step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > item.step ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm hidden sm:inline",
                      currentStep >= item.step
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {index < 2 && (
                    <div
                      className={cn(
                        "w-8 md:w-12 h-0.5 mx-2",
                        currentStep > item.step ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-tight max-w-5xl mx-auto py-8 px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Selection */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Select a Service</CardTitle>
                  {errors.service && (
                    <p className="text-sm text-destructive">{errors.service}</p>
                  )}
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service.id);
                        if (errors.service)
                          setErrors((prev) => ({ ...prev, service: "" }));
                      }}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all",
                        selectedService === service.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40 bg-card"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-foreground">
                          {service.name}
                        </h3>
                        {selectedService === service.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(service.duration_minutes)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatPrice(service.base_price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Select Date & Time</CardTitle>
                  {(errors.date || errors.time) && (
                    <p className="text-sm text-destructive">
                      {errors.date || errors.time}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        Choose a date
                      </Label>
                      <div className="border border-border rounded-lg p-2 bg-card">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (errors.date)
                              setErrors((prev) => ({ ...prev, date: "" }));
                          }}
                          disabled={(date) =>
                            date < new Date() ||
                            date.getDay() === 0 // Disable Sundays
                          }
                          className="pointer-events-auto"
                        />
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        Available time slots
                        {selectedDate && (
                          <span className="text-foreground ml-1">
                            on{" "}
                            {selectedDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available || !selectedDate}
                            onClick={() => {
                              setSelectedTime(slot.time);
                              if (errors.time)
                                setErrors((prev) => ({ ...prev, time: "" }));
                            }}
                            className={cn(
                              "py-2.5 px-3 rounded-md text-sm font-medium transition-all",
                              !slot.available || !selectedDate
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                : selectedTime === slot.time
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border hover:border-primary/40 text-foreground"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                      {!selectedDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Please select a date first
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details Form */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className={cn(
                          errors.fullName && "border-destructive"
                        )}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-destructive">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={cn(errors.phone && "border-destructive")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Service Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, Apt 4B, City"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={cn(errors.address && "border-destructive")}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific requests or access instructions..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedServiceData ? (
                      <>
                        <div className="pb-3 border-b border-border">
                          <p className="font-semibold text-foreground">
                            {selectedServiceData.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {formatDuration(selectedServiceData.duration_minutes)}
                          </p>
                        </div>

                        {selectedDate && selectedTime && (
                          <div className="pb-3 border-b border-border">
                            <p className="text-sm text-muted-foreground">
                              Date & Time
                            </p>
                            <p className="font-medium text-foreground">
                              {selectedDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-foreground">{selectedTime}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Estimated Price
                          </p>
                          <p className="text-xl font-bold text-foreground">
                            {formatPrice(selectedServiceData.base_price)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Final price may vary based on property size
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">
                          Select a service to see summary
                        </p>
                      </div>
                    )}

                    <Button
                      variant="cta"
                      size="lg"
                      className="w-full mt-4"
                      disabled={!isFormComplete || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      You'll receive confirmation via SMS & email.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
