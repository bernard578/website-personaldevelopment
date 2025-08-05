'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 text-white">
      {/* Header */}
      <header className="container mx-auto p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">GrowMe</h1>
        <nav className="space-x-4">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>“
          <Link href="#features" className="hover:underline">
            Features
          </Link>
          <Link href="#pricing" className="hover:underline">
            Pricing
          </Link>
          <Link href="#contact" className="hover:underline">
            <Button variant="secondary">Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Unlock Your Best Self
          </motion.h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">
            A personal development toolkit that combines habit tracking, goal
            setting, and mindful reflection—all in one place.
          </p>
          <Button variant="outline" size="lg" asChild className="text-lg font-semibold shadow-xl">
            <Link href="#signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white text-gray-900 py-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {[
            {
              title: "Habit Tracker",
              desc: "Build positive routines with smart reminders and streaks.",
              icon: "📈",
            },
            {
              title: "Goal Planner",
              desc: "Break big ambitions into actionable milestones.",
              icon: "🎯",
            },
            {
              title: "Reflection Journal",
              desc: "Gain insights with daily prompts and analytics.",
              icon: "📝",
            },
          ].map((f) => (
            <Card key={f.title} className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 text-center flex flex-col gap-4 items-center">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p>{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-200 py-12 text-center">
        <p>© {new Date().getFullYear()} GrowMe. All rights reserved.</p>
      </footer>
    </main>
  );
}
