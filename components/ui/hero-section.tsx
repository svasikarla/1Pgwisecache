"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const dynamicFeatures = [
  "Web Summarization",
  "Knowledge Management",
  "Smart Categorization",
  "AI-Powered Insights",
  "Content Analysis",
  "Research Assistant"
]

export default function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [stats, setStats] = useState({
    summaries: 0,
    users: 0,
    articles: 0
  })

  useEffect(() => {
    // Animate feature text
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % dynamicFeatures.length)
    }, 3000)

    // Animate stats
    const statsInterval = setInterval(() => {
      setStats({
        summaries: Math.floor(Math.random() * 10000) + 5000,
        users: Math.floor(Math.random() * 1000) + 500,
        articles: Math.floor(Math.random() * 5000) + 2000
      })
    }, 2000)

    return () => {
      clearInterval(featureInterval)
      clearInterval(statsInterval)
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-indigo-800/50 to-purple-700/50"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              WiseCache
            </span>
            <span className="mt-2 block text-xl text-indigo-200">Your AI-Powered Knowledge Companion</span>
          </h1>

          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-lg text-indigo-100 sm:text-xl"
          >
            {dynamicFeatures[currentFeature]}
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/guest">
              <Button
                size="lg"
                className="bg-white text-indigo-800 hover:bg-indigo-100"
              >
                Try It Now
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white/20"
              >
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {[
            { label: "Summaries Generated", value: stats.summaries },
            { label: "Active Users", value: stats.users },
            { label: "Articles Processed", value: stats.articles },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-indigo-300">
                {stat.value.toLocaleString()}+
              </h3>
              <p className="mt-2 text-sm text-indigo-100">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {[
            {
              title: "Instant Summaries",
              description: "Get AI-powered summaries of any web content in seconds",
              icon: "⚡"
            },
            {
              title: "Smart Categorization",
              description: "Automatically organize your saved links by topic",
              icon: "🧠"
            },
            {
              title: "Knowledge Base",
              description: "Build your personal library of insights and discoveries",
              icon: "📚"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-indigo-100">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 