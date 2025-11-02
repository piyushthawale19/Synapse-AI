import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Brain, FlaskConical, FileText, Users, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

export default function PatientDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const recommendedTrials = useQuery(api.clinicalTrials.getRecommendedForPatient);
  const recommendedPublications = useQuery(api.publications.getRecommendedForPatient);
  const recommendedExperts = useQuery(api.researchers.getRecommendedExperts);

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CuraLink</span>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here are personalized recommendations based on your interests
          </p>
        </motion.div>

        <Tabs defaultValue="trials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trials">
              <FlaskConical className="h-4 w-4 mr-2" />
              Clinical Trials
            </TabsTrigger>
            <TabsTrigger value="experts">
              <Users className="h-4 w-4 mr-2" />
              Experts
            </TabsTrigger>
            <TabsTrigger value="publications">
              <FileText className="h-4 w-4 mr-2" />
              Publications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trials" className="space-y-4">
            {recommendedTrials && recommendedTrials.length > 0 ? (
              recommendedTrials.map((trial) => (
                <motion.div
                  key={trial._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{trial.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4" />
                            {trial.location.city}, {trial.location.country}
                          </CardDescription>
                        </div>
                        <Badge variant={trial.status === "recruiting" ? "default" : "secondary"}>
                          {trial.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {trial.aiSummary && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">AI Summary</span>
                          </div>
                          <p className="text-sm">{trial.aiSummary}</p>
                        </div>
                      )}
                      <p className="text-sm mb-4">{trial.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trial.conditions.map((condition) => (
                          <Badge key={condition} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                      <Button>Learn More</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No recommended trials yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="experts" className="space-y-4">
            {recommendedExperts && recommendedExperts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedExperts.map((expert) => (
                  <motion.div
                    key={expert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{expert.name}</CardTitle>
                        <CardDescription>{expert.institution}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {expert.bio && <p className="text-sm mb-4">{expert.bio}</p>}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {expert.specialties?.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full">
                          <Heart className="h-4 w-4 mr-2" />
                          Follow
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No recommended experts yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="publications" className="space-y-4">
            {recommendedPublications && recommendedPublications.length > 0 ? (
              recommendedPublications.map((pub) => (
                <motion.div
                  key={pub._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{pub.title}</CardTitle>
                      <CardDescription>
                        {pub.authors.join(", ")} • {pub.publicationDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pub.aiSummary && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">AI Summary</span>
                          </div>
                          <p className="text-sm">{pub.aiSummary}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {pub.keywords.map((keyword) => (
                          <Badge key={keyword} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No recommended publications yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
