"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/common/Header";

const emotions = ["Happy", "Sad", "Excited", "Angry", "Calm", "Anxious"];

export default function PostIncidentPage() {
  const [description, setDescription] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !selectedEmotion) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/incidents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, emotion: selectedEmotion }),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      toast({
        title: "Success",
        description: "Your incident has been posted!",
      });
      router.push("/incidents");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <Header nameSymbol="U" />
      <main className="container mx-auto pt-20 px-4 pb-8 max-w-md">
        <motion.h1
          className="text-3xl font-bold text-purple-100 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Post Your Incident
        </motion.h1>
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-purple-100 mb-2"
                >
                  What happened?
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your incident..."
                  className="w-full bg-slate-800 text-purple-100 border-slate-600 focus:border-purple-400"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  How did it make you feel?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <AnimatePresence>
                    {emotions.map((emotion) => (
                      <motion.div
                        key={emotion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          type="button"
                          variant={
                            selectedEmotion === emotion ? "default" : "outline"
                          }
                          className={`w-full ${
                            selectedEmotion === emotion
                              ? "bg-purple-500 text-white"
                              : "bg-slate-800 text-purple-100"
                          }`}
                          onClick={() => setSelectedEmotion(emotion)}
                        >
                          {emotion}
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Posting..." : "Post Incident"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
