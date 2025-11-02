import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Brain, FlaskConical, Users, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [isResearcherLoading, setIsResearcherLoading] = useState(false);

  const handlePatientClick = () => {
    setIsPatientLoading(true);
    if (isAuthenticated) {
      navigate("/patient/onboarding");
    } else {
      navigate("/auth?role=patient");
    }
  };

  const handleResearcherClick = () => {
    setIsResearcherLoading(true);
    if (isAuthenticated) {
      navigate("/researcher/onboarding");
    } else {
      navigate("/auth?role=researcher");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">Synapse AI</span>
          </motion.div>
          
          {isAuthenticated && user ? (
            <Button onClick={() => navigate(user.role === "patient" ? "/patient/dashboard" : "/researcher/dashboard")}>
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Connecting Patients with
            <span className="text-primary"> Clinical Research</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            AI-powered platform simplifying access to clinical trials, research publications, and expert collaborations
          </p>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="cursor-pointer hover:border-primary transition-all" onClick={handlePatientClick}>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">I am a Patient or Caregiver</CardTitle>
                  <CardDescription className="text-base">
                    Find clinical trials, connect with experts, and access simplified research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" disabled={isPatientLoading}>
                    {isPatientLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cursor-pointer hover:border-primary transition-all" onClick={handleResearcherClick}>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FlaskConical className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">I am a Researcher</CardTitle>
                  <CardDescription className="text-base">
                    Manage trials, find collaborators, and engage with patients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" disabled={isResearcherLoading}>
                    {isResearcherLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Powered by AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complex medical information simplified for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>AI Summaries</CardTitle>
                  <CardDescription>
                    Complex research papers and trial details translated into simple language
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Personalized Matching</CardTitle>
                  <CardDescription>
                    Get recommendations for trials and experts based on your specific needs
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Direct Connection</CardTitle>
                  <CardDescription>
                    Connect patients with researchers through forums and direct messaging
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Synapse AI. Empowering healthcare through technology.</p>
        </div>
      </footer>
    </div>
  );
}