import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Brain, FlaskConical, Users, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function RoleSelect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateRole = useMutation(api.users.updateRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: "patient" | "researcher") => {
    setIsLoading(true);
    try {
      await updateRole({ role });
      toast.success(`Welcome as a ${role}!`);
      
      if (role === "patient") {
        navigate("/patient/onboarding");
      } else {
        navigate("/researcher/onboarding");
      }
    } catch (error) {
      toast.error("Failed to set role");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user already has a role, redirect them
  if (user?.role) {
    if (user.role === "patient") {
      navigate("/patient/dashboard");
    } else if (user.role === "researcher") {
      navigate("/researcher/dashboard");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to CuraLink
          </h1>
          <p className="text-xl text-muted-foreground">
            How would you like to use the platform?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-all h-full">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Patient or Caregiver</CardTitle>
                <CardDescription className="text-base text-center">
                  Find clinical trials, connect with experts, and access simplified research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleRoleSelection("patient")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Continue as Patient"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-all h-full">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <FlaskConical className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Researcher</CardTitle>
                <CardDescription className="text-base text-center">
                  Manage trials, find collaborators, and engage with patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleRoleSelection("researcher")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Continue as Researcher"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
