"use client";

import { AIChatbot } from "@/components/home/ai-chatbot";
import { ChemistrySimulation } from "@/components/home/chemistry-simulation";
import { FloatingElements } from "@/components/home/floating-elements";
import { ModeToggle } from "@/components/home/mode-toggle";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Atom,
  BarChart3,
  Beaker,
  Brain,
  ChevronRight,
  Dna,
  Droplets,
  FlaskRoundIcon as Flask,
  Lightbulb,
  Menu,
  Microscope,
  Rocket,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-science-pattern dark:bg-science-pattern-dark mx-auto flex min-h-screen flex-col overflow-x-hidden">
      <FloatingElements />
      <AIChatbot />

      {/* Navbar */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-lg transition-all duration-300 ${
          scrolled
            ? "bg-white/80 shadow-md dark:bg-slate-900/80"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-7" />
          </Link>
          <nav className="mx-auto hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="hover:text-primary group relative text-sm font-medium transition-colors"
            >
              Features
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#disciplines"
              className="hover:text-primary group relative text-sm font-medium transition-colors"
            >
              Disciplines
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#about"
              className="hover:text-primary group relative text-sm font-medium transition-colors"
            >
              About
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contact"
              className="hover:text-primary group relative text-sm font-medium transition-colors"
            >
              Contact
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="hidden cursor-pointer bg-white/80 transition-transform duration-200 hover:bg-white active:scale-95 sm:inline-flex dark:bg-slate-800/80 dark:hover:bg-slate-800"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="hidden cursor-pointer bg-gradient-to-r from-blue-600 to-violet-600 text-white transition-transform duration-200 hover:from-blue-700 hover:to-violet-700 active:scale-95 sm:inline-flex"
                onClick={() => router.push("/register")}
              >
                Get Started
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </nav>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="rounded-b-xl bg-white p-4 shadow-lg md:hidden dark:bg-slate-900">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="rounded-md p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#disciplines"
                className="rounded-md p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Disciplines
              </Link>
              <Link
                href="#about"
                className="rounded-md p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="rounded-md p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
                  onClick={() => router.push("/register")}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-yellow-300 opacity-20 blur-xl"></div>
          <div className="animation-delay-2000 absolute right-10 bottom-20 h-32 w-32 animate-pulse rounded-full bg-pink-300 opacity-20 blur-xl"></div>

          <div className="relative z-10 container">
            <div className="grid grid-cols-12 items-center gap-8 lg:gap-24">
              <div className="col-span-5 flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="animate-shimmer mb-2 inline-block rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-1 text-sm font-medium text-white">
                    Virtual Science Labs for Curious Minds
                  </div>
                  <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    SciNapse: Where Science Clicks with Curiosity
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-lg dark:text-slate-300">
                    Experience the{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      magic of science
                    </span>{" "}
                    with our interactive virtual laboratory. Conduct amazing
                    experiments, make discoveries, and learn in a fun, safe
                    environment!
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="animate-shimmer bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-violet-700 hover:shadow-xl"
                    onClick={() => router.push("/register")}
                  >
                    Start Exploring
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/login")}
                  >
                    Sign in
                  </Button>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      JD
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      KL
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                      MN
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-bold">1,000+</span> students already
                    experimenting
                  </p>
                </div>
              </div>
              <div className="col-span-7 flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl md:h-[500px] dark:border-slate-800">
                  <ChemistrySimulation />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative w-full py-12 md:py-24 lg:py-32"
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-white/0 to-blue-50/50 dark:from-gray-950 dark:to-gray-950"></div>
          <div className="absolute -top-10 left-1/4 h-20 w-20 rounded-full bg-green-300 opacity-20 blur-xl"></div>
          <div className="absolute top-40 right-1/4 h-32 w-32 rounded-full bg-blue-300 opacity-20 blur-xl"></div>

          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="max-w-3xl space-y-2">
                <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-sm font-medium text-white">
                  Amazing Features
                </div>
                <h2 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl dark:from-blue-400 dark:to-cyan-400">
                  Experience Science Like Never Before
                </h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed dark:text-slate-300">
                  SciNapse provides a comprehensive virtual laboratory
                  experience with cutting-edge features designed to make
                  learning science fun and engaging.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-blue-500/20 to-transparent"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Flask className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      Realistic Simulations
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Experience high-fidelity simulations that accurately
                      replicate real-world laboratory conditions and equipment.
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-yellow-500/20 to-transparent"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      Interactive Learning
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Engage with experiments through intuitive controls and
                      receive real-time feedback on your progress.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-purple-500/20 to-transparent"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      Data Analysis Tools
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Collect, visualize, and analyze experimental data with our
                      comprehensive suite of colorful analytical tools.
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-green-500/20 to-transparent"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                      AI Lab Assistant
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Get help from Professor Neutron, our AI assistant who can
                      answer questions and guide your experiments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disciplines Section */}
        <section
          id="disciplines"
          className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-black dark:to-indigo-950/80"></div>

          {/* Floating science elements */}
          <div className="animate-float absolute top-20 left-10 h-16 w-16 opacity-20">
            <Atom className="h-full w-full text-blue-500" />
          </div>
          <div className="animate-float animation-delay-2000 absolute top-40 right-20 h-12 w-12 opacity-20">
            <Dna className="h-full w-full text-purple-500" />
          </div>
          <div className="animate-float animation-delay-4000 absolute bottom-20 left-1/4 h-14 w-14 opacity-20">
            <Zap className="h-full w-full text-yellow-500" />
          </div>
          <div className="animate-float animation-delay-6000 absolute right-1/3 bottom-40 h-10 w-10 opacity-20">
            <Droplets className="h-full w-full text-green-500" />
          </div>

          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-medium text-white">
                  Exciting Disciplines
                </div>
                <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl dark:from-purple-400 dark:to-pink-400">
                  Explore Multiple Scientific Fields
                </h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed dark:text-slate-300">
                  SciNapse supports a wide range of scientific disciplines,
                  allowing students to explore various fields of study with
                  colorful, engaging experiments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute -right-2 -bottom-2 h-32 w-32 opacity-10">
                  <Beaker className="h-full w-full text-blue-500" />
                </div>
                <Image
                  src="/images/chemlab.jpg"
                  alt="Chemistry Lab"
                  width={400}
                  height={200}
                  className="mb-4 h-40 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-lg">
                      <Beaker className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Chemistry
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Mix colorful chemicals, conduct reactions, and discover the
                    molecular world through vibrant experiments.
                  </p>
                  <Link
                    href="/explore/chemistry"
                    className="mt-2 inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Explore Chemistry Labs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute -right-2 -bottom-2 h-32 w-32 opacity-10">
                  <Atom className="h-full w-full text-purple-500" />
                </div>
                <Image
                  src="/images/phylab.jpg"
                  alt="Physics Lab"
                  width={400}
                  height={200}
                  className="mb-4 h-40 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
                      <Atom className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Physics
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Investigate mechanics, electricity, and quantum phenomena
                    through dynamic, interactive simulations.
                  </p>
                  <Link
                    href="/explore/physics"
                    className="mt-2 inline-flex items-center font-medium text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Explore Physics Labs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute -right-2 -bottom-2 h-32 w-32 opacity-10">
                  <Microscope className="h-full w-full text-pink-500" />
                </div>
                <Image
                  src="/images/biolab.jpg"
                  alt="Biology Lab"
                  width={400}
                  height={200}
                  className="mb-4 h-40 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg">
                      <Microscope className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      Biology
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Examine cells, dissect virtual specimens, and study
                    ecological systems with vibrant visualizations.
                  </p>
                  <Link
                    href="/explore/biology"
                    className="mt-2 inline-flex items-center font-medium text-pink-600 hover:underline dark:text-pink-400"
                  >
                    Explore Biology Labs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Elements Section */}
        <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/80 dark:to-pink-950/80"></div>

          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-sm font-medium text-white">
                  Fun Learning
                </div>
                <h2 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl dark:from-green-400 dark:to-emerald-400">
                  Learn by Playing and Exploring
                </h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed dark:text-slate-300">
                  Our interactive elements make learning science fun and
                  engaging for students of all ages.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-pink-500/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                    Science Quests
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Embark on exciting scientific quests that challenge your
                    knowledge and reward your discoveries with badges and
                    achievements.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                      Interactive
                    </div>
                    <div className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      Gamified
                    </div>
                    <div className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      Educational
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-blue-500/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Magic Elements
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Discover interactive elements throughout the site that
                    respond to your clicks and reveal scientific surprises and
                    fun facts.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      Clickable
                    </div>
                    <div className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                      Animated
                    </div>
                    <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      Surprising
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative w-full py-12 md:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-950/80 dark:to-indigo-950/80"></div>

          <div className="relative z-10 container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-3 py-1 text-sm font-medium text-white">
                    About SciNapse
                  </div>
                  <h2 className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl dark:from-green-400 dark:to-teal-400">
                    Our Colorful Mission
                  </h2>
                  <p className="max-w-[600px] text-slate-700 md:text-xl/relaxed dark:text-slate-300">
                    SciNapse was founded with a simple yet powerful mission: to
                    make high-quality scientific education{" "}
                    <span className="font-bold text-green-600 dark:text-green-400">
                      accessible
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      fun
                    </span>{" "}
                    for everyone, regardless of location or resources.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="max-w-[600px] text-slate-700 dark:text-slate-300">
                    Our team of educators, scientists, and developers has
                    created a platform that bridges the gap between theoretical
                    knowledge and practical experience, enabling students to
                    develop critical thinking and experimental skills in a safe,
                    engaging environment.
                  </p>
                  <p className="max-w-[600px] text-slate-700 dark:text-slate-300">
                    We believe that hands-on learning is essential for
                    scientific understanding, and our virtual laboratory system
                    makes this possible for students around the world with
                    vibrant, colorful experiments that spark curiosity.
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="gap-1.5 border-2 border-green-400 hover:bg-green-50 dark:border-green-600 dark:hover:bg-green-900/30"
                  >
                    Learn More About Us
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-green-100 to-teal-100 shadow-2xl dark:border-slate-800 dark:from-green-900/20 dark:to-teal-900/20">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                      <h3 className="mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-center text-2xl font-bold text-transparent dark:from-green-400 dark:to-teal-400">
                        Our Values
                      </h3>
                      <div className="space-y-6">
                        <div className="group flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <ChevronRight className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-green-600 dark:text-green-400">
                              Accessibility
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300">
                              Making colorful science education available to all
                              students everywhere
                            </p>
                          </div>
                        </div>
                        <div className="group flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <ChevronRight className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              Innovation
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300">
                              Pushing the boundaries of educational technology
                              with vibrant experiences
                            </p>
                          </div>
                        </div>
                        <div className="group flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <ChevronRight className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              Excellence
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300">
                              Providing the highest quality educational
                              experiences with attention to detail
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-slate-950/80 dark:to-indigo-950/80"></div>

          {/* Decorative elements */}
          <div className="animate-blob absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-4000 absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-pink-300 opacity-20 mix-blend-multiply blur-3xl filter"></div>

          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  Ready to Transform Your Scientific Learning?
                </h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed dark:text-slate-300">
                  Join thousands of students and educators who are already
                  experiencing the colorful, exciting future of scientific
                  education.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="animate-shimmer bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl"
                >
                  Get Started for Free
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/30"
                >
                  Request a Demo
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 items-center gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    1000+
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Active Students
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    50+
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Virtual Experiments
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    100+
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Schools</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    24/7
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full overflow-hidden border-t bg-white dark:bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-50 to-white dark:from-slate-900 dark:to-slate-950"></div>

        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row md:py-6">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>
              <div className="animate-reverse-spin absolute inset-0 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 opacity-80"></div>
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <Atom className="h-5 w-5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" />
              </div>
            </div>
            <p className="text-center text-sm leading-loose md:text-left">
              &copy; {new Date().getFullYear()}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text font-bold text-transparent dark:from-blue-400 dark:to-violet-400">
                SciNapse
              </span>
              . All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
