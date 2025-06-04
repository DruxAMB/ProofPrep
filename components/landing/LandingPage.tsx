"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

const LandingPage = () => {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth">
      {/* Hero Section - Clerk-inspired clean design */}
      <section className="flex flex-col items-center text-center pt-16 pb-20">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-block rounded-full bg-primary-100/10 px-3 py-1 text-sm text-primary-100 backdrop-blur-sm mb-2">
            Introducing ProofPrep
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-300 pb-1">
            Ace Your Interviews with AI Practice
          </h1>
          <p className="text-xl text-light-300 max-w-2xl mx-auto leading-relaxed">
            Practice real interview questions with our AI interviewer. Get instant feedback and improve your skills before your next big opportunity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button 
              onClick={() => router.push("/sign-up")} 
              className="btn-primary group relative overflow-hidden px-8 py-6 text-lg transition-all duration-300 ease-in-out w-full sm:w-fit"
            >
              <span className="relative z-10 flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                Get Started <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <Button 
              onClick={() => scrollToSection("how-it-works")} 
              variant="outline" 
              className="px-8 py-6 text-lg hover:bg-dark-300/30 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Animated feature highlights with demo video */}
        <div className="relative mt-20 w-full max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-100/70 to-dark-100/70 z-10 pointer-events-none" />
          <div className="relative z-0 w-full overflow-hidden rounded-xl border border-dark-300 bg-dark-200/40 backdrop-blur-md">
            <div className="flex justify-center p-8 relative group">
              <Image
                src="/hello.gif"
                alt="ProofPrep AI Interviewer"
                width={480}
                height={480}
                priority
                unoptimized
                className="rounded-lg object-cover shadow-2xl transition-all duration-700 ease-in-out group-hover:brightness-[0.8]"
              />
              
              {/* Video play button overlay */}
              <button 
                className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => setVideoOpen(true)}
                aria-label="Watch demo video"
              >
                <div className="bg-primary-300/90 rounded-full p-5 flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-105">
                  <Play className="h-12 w-12 text-dark-100 fill-dark-100" />
                </div>
                <span className="absolute bottom-8 text-white font-medium bg-dark-100/80 px-4 py-2 rounded-full backdrop-blur-sm">
                  Watch Demo (2:34)
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Demo Video Dialog */}
        <Dialog 
          open={videoOpen} 
          onOpenChange={(open) => {
            setVideoOpen(open);
            if (open) {
              setVideoLoading(true);
            }
          }}
        >
          <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none">
            <DialogTitle>
              <VisuallyHidden>ProofPrep Demo Video</VisuallyHidden>
            </DialogTitle>
            <div className="relative w-full pt-[56.25%] bg-dark-100 rounded-lg overflow-hidden">
              <button 
                className="absolute top-4 right-4 z-20 p-2 bg-dark-300/80 rounded-full hover:bg-dark-300 transition-colors"
                onClick={() => setVideoOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Loading spinner */}
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-300"></div>
                </div>
              )}
              
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/C8KdmWDGYNw?autoplay=1&si=RbF8jhtfhlpGY6Qx" 
                title="ProofPrep Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </section>
      
      {/* How It Works - Clean, spaced sections */}
      <section id="how-it-works" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How ProofPrep Works</h2>
          <p className="text-light-300 max-w-2xl mx-auto">Our simple three-step process to help you prepare for your next interview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-primary-300/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-primary-100 font-bold">1</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Choose Your Role</h3>
            <p className="text-light-300">Select the job role you're preparing for and customize your practice session</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-primary-300/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-primary-100 font-bold">2</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Practice with AI</h3>
            <p className="text-light-300">Complete a realistic interview with our AI interviewer that adapts to your responses</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-primary-300/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-primary-100 font-bold">3</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Get Feedback</h3>
            <p className="text-light-300">Receive detailed feedback and actionable tips to improve your interview skills</p>
          </div>
        </div>
      </section>
      
      {/* Feature section - Clerk-inspired */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything you need to ace your interviews</h2>
          <p className="text-light-300 max-w-2xl mx-auto">Comprehensive tools to help you prepare, practice, and perfect your interview skills.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              highlighted={index === 1}
            />
          ))}
        </div>
      </section>
      
      {/* Benefits Section - Clerk-style feature list */}
      <section className="py-24 border-t border-dark-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Everything You Need to Succeed</h2>
            <p className="text-light-300 mb-8">ProofPrep gives you the tools and feedback to excel in any interview scenario.</p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">{benefit.title}</h3>
                    <p className="text-light-300">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary-300/20 to-primary-100/20 blur-lg opacity-70" />
            <div className="relative rounded-xl border border-dark-300 bg-dark-200/80 backdrop-blur-sm p-6 overflow-hidden">
              <div className="space-y-5">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Clean, focused call to action */}
      <section className="py-24 text-center border-t border-dark-300">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-light-300">
            Join thousands of professionals who are using ProofPrep to prepare for their interviews and advance their careers.
          </p>
          <Button 
            onClick={() => router.push("/sign-in")} 
            className="btn-primary group relative overflow-hidden px-10 py-6 text-lg transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
              Sign in with Google <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
          
          <p className="text-sm text-light-400 pt-4">
            No credit card required. Get started in seconds.
          </p>
        </div>
      </section>
      
      {/* Simple footer */}
      <footer className="py-12 border-t border-dark-300 text-center text-sm text-light-400">
        <p>© {new Date().getFullYear()} ProofPrep. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Data arrays
const features = [
  {
    title: "Practice Interviews",
    description: "Get tailored interviews for any role with realistic questions based on real job descriptions.",
    icon: "/calendar.svg",
    iconAlt: "Interview icon"
  },
  {
    title: "AI Feedback",
    description: "Receive instant, detailed feedback on your answers with actionable suggestions for improvement.",
    icon: "/star.svg",
    iconAlt: "Feedback icon"
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed performance analytics.",
    icon: "/logo.svg",
    iconAlt: "Progress tracking"
  }
];

const benefits = [
  {
    title: "Realistic Interview Scenarios",
    description: "Practice with AI that simulates real interviewer behaviors and questions."
  },
  {
    title: "Detailed Performance Analysis",
    description: "Get scored on clarity, relevance, technical accuracy, and more."
  },
  {
    title: "Personalized Improvement Plan",
    description: "Receive tailored recommendations based on your strengths and weaknesses."
  },
  {
    title: "On-Demand Practice",
    description: "Practice anytime, anywhere without scheduling or time constraints."
  }
];

const testimonials = [
  {
    quote: "ProofPrep helped me land my dream job! The AI interviewer gave me the confidence I needed.",
    author: "Alex Morgan",
    role: "Software Engineer"
  },
  {
    quote: "The feedback is incredibly detailed and helped me improve my technical responses tremendously.",
    author: "Jamie Chen",
    role: "Product Designer"
  }
];

// Feature Card Component - Clerk-inspired clean design
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  iconAlt,
  highlighted = false 
}: { 
  title: string; 
  description: string; 
  icon: string; 
  iconAlt: string;
  highlighted?: boolean;
}) => {
  return (
    <div 
      className={`group relative rounded-xl p-6 transition-all duration-300 ${
        highlighted 
          ? 'bg-gradient-to-b from-primary-300/10 to-transparent border border-primary-300/30' 
          : 'hover:bg-dark-300/30 border border-dark-300'
      }`}
    >
      <div className={`rounded-full p-3 mb-4 inline-flex ${highlighted ? 'bg-primary-300/20' : 'bg-dark-300/70'}`}>
        <Image src={icon} alt={iconAlt} width={24} height={24} className="transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-light-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// Testimonial Card Component - Clean, modern style
const TestimonialCard = ({ 
  quote, 
  author, 
  role 
}: { 
  quote: string; 
  author: string; 
  role: string;
}) => {
  return (
    <div className="p-4 rounded-lg bg-dark-300/30 backdrop-blur-sm border border-dark-300/50 transition-all duration-300 hover:border-primary-300/30">
      <p className="text-sm italic text-light-200 leading-relaxed">&quot;{quote}&quot;</p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-xs text-light-400">{role}</p>
        </div>
        <div className="flex -space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-primary-300" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
