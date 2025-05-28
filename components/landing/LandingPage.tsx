"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  
  return (
    <>
      {/* Hero Section */}
      <section className="card-border py-16 px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-300">
            Ace Your Interviews with AI Practice
          </h1>
          <p className="text-lg md:text-xl">
            Practice real interview questions with our AI interviewer. Get instant feedback and improve your skills before your next big opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              onClick={() => router.push("/sign-in")} 
              className="btn-primary px-8 py-6 text-lg"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => {
                const featuresSection = document.getElementById("features");
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }
              }} 
              variant="outline" 
              className="px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src="/robot.gif"
            alt="ProofPrep AI Interviewer"
            width={450}
            height={450}
            className="rounded-lg"
            priority
            unoptimized
          />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="mt-20 px-4">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            title="Practice Interviews"
            description="Get tailored interviews for any role with realistic questions based on real job descriptions."
            icon="/calendar.svg"
            iconAlt="Interview icon"
          />
          <FeatureCard
            title="AI Feedback"
            description="Receive instant, detailed feedback on your answers with actionable suggestions for improvement."
            icon="/star.svg"
            iconAlt="Feedback icon"
            highlighted
          />
          <FeatureCard
            title="Track Progress"
            description="Monitor your improvement over time with detailed performance analytics."
            icon="/logo.svg"
            iconAlt="Progress tracking"
          />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="mt-20 px-4">
        <h2 className="text-3xl font-semibold text-center">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <TestimonialCard
            quote="ProofPrep helped me land my dream job! The AI interviewer gave me the confidence I needed."
            author="Alex Morgan"
            role="Software Engineer"
          />
          <TestimonialCard
            quote="The feedback is incredibly detailed and helped me improve my technical responses tremendously."
            author="Jamie Chen"
            role="Product Designer"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mt-20 card-border p-12 text-center">
        <h2 className="text-3xl font-semibold">Ready to Ace Your Next Interview?</h2>
        <p className="mt-4 text-xl max-w-2xl mx-auto">
          Join thousands of professionals who are using ProofPrep to prepare for their interviews and advance their careers.
        </p>
        <Button 
          onClick={() => router.push("/sign-in")} 
          className="btn-primary px-8 py-6 text-lg mt-8"
        >
          Sign in with Google
        </Button>
      </section>
    </>
  );
};

// Feature Card Component
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
    <div className={`card-border p-6 flex flex-col items-center text-center ${highlighted ? 'border-primary-300' : ''}`}>
      <div className="rounded-full bg-dark-300 p-4 mb-4">
        <Image src={icon} alt={iconAlt} width={32} height={32} />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// Testimonial Card Component
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
    <div className="card-border p-6">
      <p className="italic">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4 flex items-center">
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-light-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
