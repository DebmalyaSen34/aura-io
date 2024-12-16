"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const INCIDENTS_PER_PAGE = 10;

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const observer = useRef();
  const { toast } = useToast();

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
        `/api/user/incidents/getIncidents?page=${pageNumber}&limit=${INCIDENTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch incidents");
      }
      const data = await response.json();
      if (data.success) {
        setTotalIncidents(data.pagination.total);
        setHasMore(pageNumber < data.pagination.totalPages);
        return data.incidents;
      } else {
        throw new Error(data.message || "Failed to fetch incidents");
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadIncidents = async () => {
      const newIncidents = await fetchIncidents(page);
      setIncidents((prev) => [...prev, ...newIncidents]);
    };

    loadIncidents();
  }, [page]);

  const toggleLike = (id) => {
    // This is a placeholder. In a real app, you'd call an API to toggle the like status
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id ? { ...incident, liked: !incident.liked } : incident
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-100 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-purple-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <Header nameSymbol="U" />
      <main className="container max-w-lg mx-auto pt-20 px-4 pb-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-6">
          Your Incidents
        </h1>
        <AnimatePresence>
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              ref={
                index === incidents.length - 1 ? lastIncidentElementRef : null
              }
            >
              <Card className="bg-slate-700/50 border-slate-600 mb-4 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar className="h-10 w-10 bg-purple-600">
                      <AvatarFallback>
                        {incident.user_id.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-purple-100 font-semibold">
                        {incident.description}
                      </p>
                      <p className="text-purple-300 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(incident.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`text-lg font-semibold ${
                        incident.aura_points > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {incident.aura_points > 0 ? "+" : ""}
                      {incident.aura_points}
                    </span>
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-300 hover:text-purple-100"
                        onClick={() => toggleLike(incident.id)}
                      >
                        <Heart className="w-5 h-5 fill-purple-400" />
                        <span className="ml-1">{incident.total_likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-300 hover:text-purple-100"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="ml-1">{incident.total_comments}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="text-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <svg
                className="w-6 h-6 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
            <p className="text-purple-300 mt-2">Loading more incidents...</p>
          </div>
        )}
        {!loading && !hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-4"
          >
            <p className="text-purple-300">
              {incidents.length === 0
                ? "You don't have any incidents yet."
                : `All incidents loaded. Total: ${totalIncidents}`}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
