'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}

export function AuthForms() {
    const [isLogin, setIsLogin] = useState(true)

    const toggleForm = () => setIsLogin(!isLogin)

    return (
        <Card className="w-full max-w-md mx-auto mt-8 bg-zinc-800/50 border-zinc-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {isLogin ? 'Login' : 'Register'}
                </CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    {isLogin ? 'Welcome back to Aura.io' : 'Join the Aura.io community'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    <motion.form
                        key={isLogin ? 'login' : 'register'}
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" placeholder="Your name" className="bg-zinc-700 border-zinc-600 text-zinc-100" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" className="bg-zinc-700 border-zinc-600 text-zinc-100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" className="bg-zinc-700 border-zinc-600 text-zinc-100" />
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </motion.form>
                </AnimatePresence>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-zinc-400 text-center w-full">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    {' '}
                    <button onClick={toggleForm} className="text-purple-400 hover:text-purple-300 underline">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </CardFooter>
        </Card>
    )
}

