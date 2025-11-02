import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Brain, FlaskConical, Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

export default function ResearcherDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const collaborators = useQuery(api.researchers.searchCollaborators, {});
  const connectionRequests = useQuery(api.researchers.listConnectionRequests);

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
            Welcome, Dr. {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your research, trials, and collaborations
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collaborators">
              <Users className="h-4 w-4 mr-2" />
              Collaborators
            </TabsTrigger>
            <TabsTrigger value="requests">
              <MessageSquare className="h-4 w-4 mr-2" />
              Requests
              {connectionRequests && connectionRequests.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {connectionRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Institution:</span> {user.institution || "Not set"}
                    </p>
                    {user.specialties && user.specialties.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.specialties.map((s) => (
                            <Badge key={s} variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Clinical Trials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create New Trial</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Forums
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Communities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-4">
            {collaborators && collaborators.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {collaborators.slice(0, 10).map((collab) => (
                  <motion.div
                    key={collab._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{collab.name}</CardTitle>
                        <CardDescription>{collab.institution}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {collab.specialties && collab.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {collab.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button variant="outline" className="w-full">
                          Connect
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
                  <p className="text-muted-foreground">No collaborators found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {connectionRequests && connectionRequests.length > 0 ? (
              connectionRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{request.fromUser?.name}</CardTitle>
                      <CardDescription>{request.fromUser?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {request.message && (
                        <p className="text-sm mb-4">{request.message}</p>
                      )}
                      <div className="flex gap-2">
                        <Button className="flex-1">Accept</Button>
                        <Button variant="outline" className="flex-1">
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
