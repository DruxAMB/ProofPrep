"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Building, Users, Globe, BookOpen, Banknote } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

type JobPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const jobOpenings: JobPosition[] = [
  {
    id: "fe-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a talented Frontend Engineer to join our engineering team and help build the next generation of interview preparation tools.",
    responsibilities: [
      "Develop and maintain user-facing features using React, TypeScript, and Next.js",
      "Collaborate with designers to implement UI/UX designs with precision and attention to detail",
      "Create reusable components and implement responsive designs using Tailwind CSS",
      "Optimize applications for maximum performance and user experience",
      "Participate in code reviews and contribute to technical discussions"
    ],
    requirements: [
      "3+ years of experience in frontend development with React",
      "Strong JavaScript/TypeScript skills and understanding of modern web technologies",
      "Experience with Next.js and Tailwind CSS or similar technologies",
      "Knowledge of web performance optimization techniques",
      "Strong communication skills and ability to work in a remote team"
    ]
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    department: "AI Team",
    location: "Remote",
    type: "Full-time",
    description: "Join our AI team to advance our interview simulation and feedback systems with cutting-edge machine learning technologies.",
    responsibilities: [
      "Research, design and implement ML models for natural language processing",
      "Train and fine-tune large language models for interview simulation",
      "Develop algorithms to analyze interview responses and provide feedback",
      "Collaborate with engineering team to integrate ML models into our platform",
      "Stay up-to-date with recent advancements in AI and NLP"
    ],
    requirements: [
      "MSc or PhD in Computer Science, Machine Learning, or related field",
      "3+ years of experience in machine learning and NLP",
      "Experience with LLM fine-tuning and prompt engineering",
      "Proficiency in Python and ML frameworks such as PyTorch or TensorFlow",
      "Experience with deploying ML models to production"
    ]
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a creative Product Designer to craft intuitive and engaging experiences for our interview preparation platform.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs for web applications",
      "Collaborate with product and engineering teams to deliver outstanding user experiences",
      "Conduct user research and incorporate feedback into design iterations",
      "Maintain and evolve our design system",
      "Champion user-centered design principles across the organization"
    ],
    requirements: [
      "3+ years of product design experience for web applications",
      "Strong portfolio showcasing UX thinking and visual design skills",
      "Proficiency in design tools (Figma, Adobe Creative Suite, etc.)",
      "Experience working in agile environments",
      "Strong communication and presentation skills"
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  
  const openJobModal = (job: JobPosition) => {
    setSelectedJob(job);
  };
  
  const closeJobModal = () => {
    setSelectedJob(null);
  };
  
  const openApplyForm = () => {
    setIsApplyOpen(true);
  };
  
  const closeApplyForm = () => {
    setIsApplyOpen(false);
  };

  return (
    <PublicLayout>
      <div className="flex flex-col pb-20">
      {/* Hero section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
          Join Our Team
        </h1>
        <p className="text-xl text-light-300 max-w-3xl mb-8">
          We're on a mission to revolutionize interview preparation with AI. Join us in helping millions of people land their dream jobs.
        </p>
        <div className="flex flex-wrap gap-5 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-300/30 rounded-full">
            <Building className="w-4 h-4 text-primary-200" />
            <span className="text-sm">Remote-first</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-300/30 rounded-full">
            <Users className="w-4 h-4 text-primary-200" />
            <span className="text-sm">Diverse & Inclusive</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-300/30 rounded-full">
            <Globe className="w-4 h-4 text-primary-200" />
            <span className="text-sm">Global Team</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-300/30 rounded-full">
            <BookOpen className="w-4 h-4 text-primary-200" />
            <span className="text-sm">Learning & Development</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-300/30 rounded-full">
            <Banknote className="w-4 h-4 text-primary-200" />
            <span className="text-sm">Competitive Salary</span>
          </div>
        </div>
      </div>
      
      {/* Open positions */}
      <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobOpenings.map((job) => (
          <div 
            key={job.id}
            className="rounded-lg border border-dark-300/50 bg-dark-300/10 p-6 hover:border-primary-200/50 transition-all cursor-pointer"
            onClick={() => openJobModal(job)}
          >
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{job.department}</span>
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{job.location}</span>
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{job.type}</span>
            </div>
            <p className="text-sm text-light-300 mb-4">{job.description}</p>
            <button 
              className="text-primary-200 text-sm flex items-center gap-1 hover:text-primary-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openJobModal(job);
              }}
            >
              View details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* No positions message */}
      {jobOpenings.length === 0 && (
        <div className="text-center py-12 bg-dark-300/10 rounded-lg border border-dark-300/30">
          <p className="text-xl mb-2">No open positions at the moment</p>
          <p className="text-light-300">Check back soon or send us your resume for future opportunities</p>
        </div>
      )}
      
      {/* Job details modal */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={closeJobModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
              <button 
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={closeJobModal}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogHeader>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{selectedJob.department}</span>
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{selectedJob.location}</span>
              <span className="px-2 py-1 text-xs bg-dark-300/50 rounded-md">{selectedJob.type}</span>
            </div>
            
            <p className="mb-6">{selectedJob.description}</p>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Responsibilities</h4>
              <ul className="space-y-2">
                {selectedJob.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary-200 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Requirements</h4>
              <ul className="space-y-2">
                {selectedJob.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary-200 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <DialogFooter>
              <Button 
                className="w-full sm:w-auto"
                onClick={openApplyForm}
              >
                Apply for this position
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Typeform-like application modal */}
      <Dialog open={isApplyOpen} onOpenChange={closeApplyForm}>
        <DialogContent className="sm:max-w-[600px] h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedJob ? `Apply for ${selectedJob.title}` : 'Apply'}
            </DialogTitle>
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={closeApplyForm}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            <iframe 
              src="https://form.typeform.com/to/placeholder" 
              width="100%"
              height="100%"
              className="border-0"
              title="Application Form"
            >
              {/* Placeholder for Typeform - in a real app, you'd use their embed API */}
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-xl mb-4">Application form will be loaded here</p>
                <p className="text-light-300">In a production app, this would be a real Typeform</p>
              </div>
            </iframe>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PublicLayout>
  );
}
