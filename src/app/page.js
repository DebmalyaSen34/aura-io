import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Zap, Share2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Aura.io
        </h1>
        <nav>
          <Button asChild variant="ghost" className="text-white hover:text-purple-300 mr-4">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Share Your Daily Aura</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Post your daily incidents, let AI evaluate your aura, and connect with others on their journey.
        </p>
        <Button asChild size="lg" className="text-lg">
          <Link href="/register">
            Start Your Aura Journey <ArrowRight className="ml-2" />
          </Link>
        </Button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Star className="w-10 h-10 text-yellow-400" />}
            title="AI Aura Evaluation"
            description="Our AI analyzes your daily incidents and assigns an aura value."
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-blue-400" />}
            title="Track Your Growth"
            description="Watch your aura evolve as you share and reflect on your experiences."
          />
          <FeatureCard
            icon={<Share2 className="w-10 h-10 text-green-400" />}
            title="Connect & Share"
            description="Engage with others, share insights, and grow together."
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-left">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-purple-200">{description}</p>
    </div>
  )
}

