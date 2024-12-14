"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, User, Calendar, Zap, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/common/Header";
import { getReadableDate } from "@/utils/changeDateToReadable";
import { capitalizeWords } from "@/utils/capitalizeWords";
import ProfileLoadingScreen from "@/components/profile/profileLoadingScreen";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [topIncidents, setTopIncidents] = useState(null);
  const [showTopIncidents, setShowTopIncidents] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/getDetails");
        const data = await response.json();
        setUserProfile(data.user);
      } catch (error) {
        console.log("Error fetching user profile", error);
      }
    };
    const fetchUserIncidents = async () => {
      try {
        const response = await fetch("/api/user/incidents/getIncidents");
        const data = await response.json();
        const sortedIncidents = data.incidents.sort(
          (a, b) => b.aura_points - a.aura_points
        );
        setTopIncidents(sortedIncidents.slice(0, 3));
      } catch (error) {
        console.log("Error fetching user incidents", error);
      }
    };
    fetchUserProfile();
    fetchUserIncidents();
  }, []);

  useEffect(() => {
    console.log("Top incidents: ", topIncidents);
  }, [topIncidents]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  if (!userProfile) {
    return <ProfileLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <Header nameSymbol={capitalizeWords(userProfile.name[0])} />
      <main className="container max-w-lg mx-auto pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-700/50 border-slate-700 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={userProfile.avatar}
                    alt={userProfile.name}
                  />
                  <AvatarFallback>
                    {capitalizeWords(userProfile.name[0])}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-purple-100">
                    {capitalizeWords(userProfile.name)}
                  </h1>
                  <p className="text-purple-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {getReadableDate(userProfile.created_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-600/50 rounded-lg p-4 text-center">
                  <User className="w-6 h-6 mx-auto mb-2 text-purple-300" />
                  <p className="text-lg font-semibold text-purple-100">
                    {userProfile.total_incidents}
                  </p>
                  <p className="text-sm text-purple-300">Total Incidents</p>
                </div>
                <div className="bg-slate-600/50 rounded-lg p-4 text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-purple-300" />
                  <p className="text-lg font-semibold text-purple-100">
                    {userProfile.total_aura_points}
                  </p>
                  <p className="text-sm text-purple-300">Aura Points</p>
                </div>
              </div>

              <div className="mb-6">
                <Button
                  onClick={() => setShowTopIncidents(!showTopIncidents)}
                  className="w-full bg-slate-600 hover:bg-slate-500 text-purple-100 justify-between"
                >
                  <span className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Top Incidents
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showTopIncidents ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                <AnimatePresence>
                  {showTopIncidents && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mt-4 space-y-2">
                        {topIncidents.map((incident) => (
                          <div
                            key={incident.id}
                            className="bg-slate-600/30 rounded-lg p-3 flex justify-between items-center"
                          >
                            <p className="text-purple-100">
                              {incident.description}
                            </p>
                            <span
                              className={`text-${
                                incident.aura_points >= 0 ? "green" : "red"
                              }-400 font-semibold`}
                            >
                              {incident.aura_points >= 0 ? "+" : "-"}
                              {incident.aura_points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
