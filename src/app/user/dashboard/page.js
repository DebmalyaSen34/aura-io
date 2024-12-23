"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  User,
  Calendar,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  ReferenceLine,
  Area,
} from "recharts";
import Header from "@/components/common/Header";
import { getReadableDate } from "@/utils/changeDateToReadable";
import { capitalizeWords } from "@/utils/capitalizeWords";
import ProfileLoadingScreen from "@/components/profile/profileLoadingScreen";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  incidents: {
    label: "Incidents",
    color: "hsl(259, 94%, 67%)",
  },
  pos_aura: {
    label: "+ve Aura",
    color: "hsl(143, 55%, 62%)",
  },
  neg_aura: {
    label: "-ve Aura",
    color: "hsl(346, 87%, 60%)",
  },
  total_aura: {
    label: "Total Aura",
    color: "hsl(230, 100%, 69%)",
  },
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [weeklyIncidents, setWeeklyIncidents] = useState([]);
  const [topIncidents, setTopIncidents] = useState(null);
  const [showTopIncidents, setShowTopIncidents] = useState(false);

  const processIncidentsForLast7Days = (incidents) => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        incidents: 0,
        pos_aura: 0,
        neg_aura: 0,
        total_aura: 0,
      };
    });

    incidents.forEach((incident) => {
      const incidentDate = new Date(incident.created_at)
        .toISOString()
        .split("T")[0];
      const dayData = last7Days.find((day) => day.date === incidentDate);
      if (dayData) {
        dayData.incidents += 1;
        if (incident.aura_points >= 0) {
          dayData.pos_aura += incident.aura_points;
        } else {
          dayData.neg_aura += Math.abs(incident.aura_points);
        }
        dayData.total_aura += incident.aura_points;
      }
    });

    return last7Days;
  };

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
        setIncidents(data.incidents);
        const sortedIncidents = data.incidents.sort(
          (a, b) => b.aura_points - a.aura_points
        );
        setTopIncidents(sortedIncidents.slice(0, 3));
      } catch (error) {
        console.log("Error fetching user incidents", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUserProfile(), fetchUserIncidents()]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (incidents.length > 0) {
      const processedData = processIncidentsForLast7Days(incidents);
      setWeeklyIncidents(processedData);
    }
    console.log("Incidents: ", incidents);
  }, [incidents]);

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
                    {userProfile.total_incidents || 0}
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
                              {incident.aura_points >= 0 ? "+" : ""}
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
          <Card className="bg-slate-700/50 border-slate-700 overflow-hidden mt-5">
            <CardHeader>
              <CardTitle className="text-white">Incidents Overview</CardTitle>
              <CardDescription className="text-purple-300">
                Last 7 Days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyIncidents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => value.slice(5)}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="incidents"
                      stroke="var(--color-incidents)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Showing total incidents for the last 7 days
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-5 bg-slate-700/50 border-slate-700 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Aura Journey</CardTitle>
              <CardDescription className="text-purple-300">
                Last 7 Days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart data={weeklyIncidents} height={300}>
                  <defs>
                    <linearGradient
                      id="colorPosAura"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-pos_aura)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-pos_aura)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorNegAura"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-neg_aura)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-neg_aura)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(5)}
                  />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend
                    className="text-white"
                    content={<ChartLegendContent />}
                  />
                  <ReferenceLine y={0} stroke="#666" />
                  <Area
                    type="monotone"
                    dataKey="pos_aura"
                    stroke="var(--color-pos_aura)"
                    fillOpacity={1}
                    fill="url(#colorPosAura)"
                  />
                  <Area
                    type="monotone"
                    dataKey="neg_aura"
                    stroke="var(--color-neg_aura)"
                    fillOpacity={1}
                    fill="url(#colorNegAura)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Showing your Aura points for the last 7 days
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
