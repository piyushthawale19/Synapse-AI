import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function PatientOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useMutation(api.patients.updateProfile);
  
  const [isLoading, setIsLoading] = useState(false);
  const [conditions, setConditions] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState<{
    conditions?: string;
    city?: string;
    country?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!conditions.trim()) {
      newErrors.conditions = "Please enter at least one medical condition or interest";
    } else {
      const conditionsArray = conditions.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
      if (conditionsArray.length === 0) {
        newErrors.conditions = "Please enter valid medical conditions";
      }
    }
    
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!country.trim()) {
      newErrors.country = "Country is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);

    try {
      const conditionsArray = conditions
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      await updateProfile({
        medicalConditions: conditionsArray,
        location: { city: city.trim(), country: country.trim() },
      });

      toast.success("Profile updated successfully!");
      navigate("/patient/dashboard");
    } catch (error) {
      console.error(error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes("authenticated")) {
          setErrors({ general: "You must be logged in to continue" });
          toast.error("Authentication error. Please log in again.");
          setTimeout(() => navigate("/auth"), 2000);
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          setErrors({ general: "Network error. Please check your connection and try again." });
          toast.error("Connection error. Please try again.");
        } else {
          setErrors({ general: error.message });
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        setErrors({ general: "An unexpected error occurred" });
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome, {user?.name || "Patient"}!</CardTitle>
            <CardDescription>
              Let's personalize your experience. Tell us about your health interests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions or Interests</Label>
                <Textarea
                  id="conditions"
                  placeholder="e.g., diabetes, heart disease, cancer research"
                  value={conditions}
                  onChange={(e) => {
                    setConditions(e.target.value);
                    if (errors.conditions) {
                      setErrors({ ...errors, conditions: undefined });
                    }
                  }}
                  rows={4}
                  required
                  className={errors.conditions ? "border-destructive" : ""}
                />
                {errors.conditions && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.conditions}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Separate multiple conditions with commas. This helps us recommend relevant trials and research.
                </p>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) {
                          setErrors({ ...errors, city: undefined });
                        }
                      }}
                      required
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="USA"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (errors.country) {
                          setErrors({ ...errors, country: undefined });
                        }
                      }}
                      required
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}