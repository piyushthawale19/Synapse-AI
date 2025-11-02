import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ResearcherOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useMutation(api.researchers.updateProfile);
  
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [orcidId, setOrcidId] = useState("");
  const [availableForMeetings, setAvailableForMeetings] = useState(true);
  const [errors, setErrors] = useState<{
    specialties?: string;
    researchInterests?: string;
    institution?: string;
    orcidId?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!institution.trim()) {
      newErrors.institution = "Institution is required";
    }
    
    if (!specialties.trim()) {
      newErrors.specialties = "Please enter at least one specialty";
    } else {
      const specialtiesArray = specialties.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
      if (specialtiesArray.length === 0) {
        newErrors.specialties = "Please enter valid specialties";
      }
    }
    
    if (!researchInterests.trim()) {
      newErrors.researchInterests = "Please enter at least one research interest";
    } else {
      const interestsArray = researchInterests.split(",").map((i) => i.trim()).filter((i) => i.length > 0);
      if (interestsArray.length === 0) {
        newErrors.researchInterests = "Please enter valid research interests";
      }
    }
    
    // Validate ORCID format if provided (basic validation)
    if (orcidId.trim() && !/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/.test(orcidId.trim())) {
      newErrors.orcidId = "Invalid ORCID format. Expected format: 0000-0000-0000-0000";
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
      const specialtiesArray = specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      const interestsArray = researchInterests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await updateProfile({
        specialties: specialtiesArray,
        researchInterests: interestsArray,
        institution: institution.trim(),
        bio: bio.trim() || undefined,
        orcidId: orcidId.trim() || undefined,
        availableForMeetings,
      });

      toast.success("Profile created successfully!");
      navigate("/researcher/dashboard");
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
          toast.error("Failed to create profile. Please try again.");
        }
      } else {
        setErrors({ general: "An unexpected error occurred" });
        toast.error("Failed to create profile. Please try again.");
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
            <CardTitle className="text-3xl">Welcome, Dr. {user?.name || "Researcher"}!</CardTitle>
            <CardDescription>
              Set up your professional profile to connect with patients and collaborators.
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
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  placeholder="Harvard Medical School"
                  value={institution}
                  onChange={(e) => {
                    setInstitution(e.target.value);
                    if (errors.institution) {
                      setErrors({ ...errors, institution: undefined });
                    }
                  }}
                  required
                  className={errors.institution ? "border-destructive" : ""}
                />
                {errors.institution && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.institution}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  placeholder="e.g., Oncology, Cardiology, Neurology"
                  value={specialties}
                  onChange={(e) => {
                    setSpecialties(e.target.value);
                    if (errors.specialties) {
                      setErrors({ ...errors, specialties: undefined });
                    }
                  }}
                  required
                  className={errors.specialties ? "border-destructive" : ""}
                />
                {errors.specialties ? (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.specialties}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Separate with commas</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Research Interests</Label>
                <Input
                  id="interests"
                  placeholder="e.g., Cancer immunotherapy, Clinical trials"
                  value={researchInterests}
                  onChange={(e) => {
                    setResearchInterests(e.target.value);
                    if (errors.researchInterests) {
                      setErrors({ ...errors, researchInterests: undefined });
                    }
                  }}
                  required
                  className={errors.researchInterests ? "border-destructive" : ""}
                />
                {errors.researchInterests ? (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.researchInterests}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Separate with commas</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description of your research and experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcid">ORCID iD (Optional)</Label>
                <Input
                  id="orcid"
                  placeholder="0000-0000-0000-0000"
                  value={orcidId}
                  onChange={(e) => {
                    setOrcidId(e.target.value);
                    if (errors.orcidId) {
                      setErrors({ ...errors, orcidId: undefined });
                    }
                  }}
                  className={errors.orcidId ? "border-destructive" : ""}
                />
                {errors.orcidId && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.orcidId}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Available for Meetings</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow patients to request consultations
                  </p>
                </div>
                <Switch
                  checked={availableForMeetings}
                  onCheckedChange={setAvailableForMeetings}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating profile...
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