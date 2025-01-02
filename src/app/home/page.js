"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  PlusCircle,
  Sparkles,
  ChevronsUp,
  ChevronsDown,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/common/Header";
import PostLoader from "@/components/homePage/postLoader";
import AuraPointsAnimation from "@/components/homePage/AuraPointAnimation";
import { formatDateBetter } from "@/utils/changeDateToReadable";
import { capitalizeNames } from "@/utils/capitalizeWords";
import { handleVote, getVotesfromCache } from "@/utils/voteHandler";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const INCIDENTS_PER_PAGE = 6;

export default function HomePage() {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [votes, setVotes] = useState({});
  const [showAddIncident, setShowAddIncident] = useState(false);
  const [newIncident, setNewIncident] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auraPoints, setAuraPoints] = useState(null);

  const { toast } = useToast();
  const router = useRouter();
  const observer = useRef();

  const lastIncidentElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchIncidents = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/user/homePage?page=${pageNumber}&limit=${INCIDENTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch incidents");
      }
      const data = await response.json();
      if (data.success) {
        setIncidents((prev) => [...prev, ...data.incidents]);
        setHasMore(data.incidents.length === INCIDENTS_PER_PAGE);
      } else {
        throw new Error(data.message || "Failed to fetch incidents");
      }
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents(page);
  }, [page]);

  useEffect(() => {
    const cachedVotes = getVotesfromCache();
    setVotes(cachedVotes);
  }, []);

  const toggleVote = async (id, voteType) => {
    const currentVote = votes[id]?.type;
    try {
      const { upvotes, downvotes, userVote } = await handleVote(
        id,
        voteType,
        currentVote
      );

      setVotes((prevVotes) => {
        const newVotes = { ...prevVotes };
        if (userVote === null) {
          delete newVotes[id];
        } else {
          newVotes[id] = { type: userVote };
        }
        return newVotes;
      });

      setIncidents((prevIncidents) => {
        return prevIncidents.map((incident) => {
          if (incident.id === id) {
            return {
              ...incident,
              userVote,
              total_ups: upvotes,
              total_downs: downvotes,
            };
          }
          return incident;
        });
      });
    } catch (error) {
      console.error("Error while updating vote in database: ", error);
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAddIncident = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuraPoints(null);
    try {
      // Get the aura points from the sentiment analysis API
      const response = await fetch("/api/user/incidents/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newIncident }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setAuraPoints(data.aura);

      // Push the incident to the database of the user
      const postIncidentResponse = await fetch(
        "/api/user/incidents/write-incident",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newIncident,
            aura_points: data.aura,
          }),
        }
      );

      if (!postIncidentResponse.ok) {
        throw new Error("Failed to post incident");
      }

      toast({
        title: "Success",
        description: "Incident added successfully",
      });

      setNewIncident("");
      setShowAddIncident(false);

      console.log("Incident added successfully");
    } catch (error) {
      console.error("Error adding incident:", error);
      toast({
        title: "Error",
        description: "Failed to add incident. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = (userId) => {
    router.push(`/user/dashboard?userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <Header nameSymbol="A" />
      <main className="container max-w-lg mx-auto pt-20 px-4 pb-8">
        <Button
          onClick={() => setShowAddIncident(true)}
          className="mb-6 w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Incident
        </Button>

        <AnimatePresence>
          {incidents.map((incident, index) => (
            <motion.div
              key={`${incident.id} - ${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              ref={
                index === incidents.length - 1 ? lastIncidentElementRef : null
              }
            >
              <Card className="bg-slate-700/50 border-slate-700 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      className="h-10 w-10 bg-purple-600 cursor-pointer"
                      onClick={() => handleAvatarClick(incident.user_id)}
                    >
                      <AvatarFallback>
                        {incident.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-purple-300">
                            {capitalizeNames(incident.username)}
                          </span>
                          <span className="text-sm text-slate-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDateBetter(incident.created_at)}
                          </span>
                        </div>
                        <span
                          className={`text-lg font-medium ${
                            incident.aura_points > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {incident.aura_points > 0 ? "+" : ""}
                          {incident.aura_points}
                        </span>
                      </div>
                      <p className="mt-2 text-purple-100">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-purple-300">
                        <button
                          className="flex items-center gap-1 hover:text-purple-100 transition-colors"
                          onClick={() => toggleVote(incident.id, "up")}
                        >
                          <ChevronsUp
                            className={`w-5 h-5 ${
                              votes[incident.id]?.type === "up"
                                ? "text-green-400"
                                : ""
                            }`}
                          />
                          <span className="text-sm">
                            {incident.total_ups || 0}
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-purple-100 transition-colors"
                          onClick={() => toggleVote(incident.id, "down")}
                        >
                          <ChevronsDown
                            className={`w-5 h-5 ${
                              votes[incident.id]?.type === "down"
                                ? "text-red-400"
                                : ""
                            }`}
                          />
                          <span className="text-sm">
                            {incident.total_downs || 0}
                          </span>
                        </button>
                        {/* Implement the comment feature later */}
                        {/* <button className="flex items-center gap-1 hover:text-purple-100 transition-colors ml-auto">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-sm">
                            {incident.total_comments || 0}
                          </span>
                        </button> */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="space-y-4">
            <PostLoader />
            <PostLoader />
          </div>
        )}

        {!loading && !hasMore && (
          <p className="text-center text-purple-300 mt-4">
            No more incidents to load.
          </p>
        )}
      </main>

      <Dialog open={showAddIncident} onOpenChange={setShowAddIncident}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg mx-auto p-4 sm:p-6 md:p-8 lg:p-10 sm:mx-4 md:mx-8 lg:mx-16">
          <DialogHeader>
            <DialogTitle className="text-purple-800">
              Add a Life Incident
            </DialogTitle>
            <DialogDescription className="text-zinc-300">
              Share what happened in your day. Our AI will evaluate and assign
              an aura value.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddIncident} className="space-y-4">
            <div>
              <Label htmlFor="incident" className="text-purple-300">
                What happened?
              </Label>
              <Textarea
                id="incident"
                placeholder="Describe your life incident..."
                className="bg-slate-700/50 border-slate-700 text-stone-400"
                value={newIncident}
                onChange={(e) => setNewIncident(e.target.value)}
                disabled={isSubmitting}
                maxLength={140}
              />
            </div>
            <p className="text-sm text-red-500">
              Disclaimer: Your incidents will be shared publicly. So be careful.
              Don't share anything that may harm anyone else's sentiments.
            </p>
            <Button
              type="submit"
              className="bg-slate-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <AuraPointsAnimation />
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Submit Incident
                </>
              )}
            </Button>
          </form>
          {auraPoints !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-center"
            >
              <h3 className="text-xl font-semibold text-purple-300 mb-2">
                Your Aura Points
              </h3>
              <div
                className={`text-4xl font-bold ${
                  auraPoints > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {auraPoints > 0 ? "+" : ""}
                {auraPoints}
              </div>
              <p className="mt-2 text-zinc-400">
                {auraPoints > 0
                  ? "Positive energy! Keep up the good work!"
                  : "Negative energy detected. Try to focus on positive actions."}
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
