'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { Heart, MessageSquare, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const incidents = [
    {
        id: 1,
        avatar: 'A',
        points: -200,
        text: 'Had an argument with a colleague',
        liked: false
    },
    {
        id: 2,
        avatar: 'B',
        points: 500,
        text: 'Helped an elderly neighbor with groceries',
        liked: false
    }
]

export default function HomePage() {
    const [likedIncidents, setLikedIncidents] = useState(new Set())
    const [isNewUser, setIsNewUser] = useState(true)
    const [showAddIncident, setShowAddIncident] = useState(false)

    const toggleLike = (id) => {
        setLikedIncidents(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const handleAddIncident = (e) => {
        e.preventDefault()
        // Here you would typically send the new incident to your backend
        // For now, we'll just close the dialog and set isNewUser to false
        setShowAddIncident(false)
        setIsNewUser(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl fixed top-0 w-full z-50">
                <div className="container flex items-center justify-between h-14 px-4">
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-slate-600 bg-clip-text text-transparent">
                        Aura.io
                    </h1>
                    <Avatar className="h-8 w-8 bg-purple-600">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            <main className="container max-w-lg mx-auto pt-20 px-4">
                {isNewUser && (
                    <Card className="mb-6 bg-slate-900/50 border-slate-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <p className="text-purple-100">Add your first life incident to see posts!</p>
                            <Button onClick={() => setShowAddIncident(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Incident
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <motion.div
                            key={incident.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-slate-700/50 border-slate-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-8 w-8 bg-purple-600">
                                            <AvatarFallback>{incident.avatar}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-purple-100">{incident.text}</span>
                                        <span
                                            className={`ml-auto text-lg font-semibold ${incident.points > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}
                                        >
                                            {incident.points > 0 ? '+' : ''}{incident.points}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
                                            onClick={() => toggleLike(incident.id)}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${likedIncidents.has(incident.id) ? 'fill-current text-purple-400' : ''}`}
                                            />
                                            <span className="text-sm">Like</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="text-sm">Comment</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Dialog open={showAddIncident} onOpenChange={setShowAddIncident}>
                <DialogContent className="bg-slate-900 border-slate-700 max-w-lg mx-auto p-4 sm:p-6 md:p-8 lg:p-10 sm:mx-4 md:mx-8 lg:mx-16">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Add a Life Incident</DialogTitle>
                        <DialogDescription className="text-zinc-300">
                            Share what happened in your day. Our AI will evaluate and assign an aura value.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddIncident} className="space-y-4">
                        <div>
                            <Label htmlFor="incident" className="text-purple-300">What happened?</Label>
                            <Textarea
                                id="incident"
                                placeholder="Describe your life incident..."
                                className="bg-slate-700/50 border-slate-700 text-stone-400"
                            />
                        </div>
                        <Button type="submit" className="bg-slate-800">Submit Incident</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}