import { Header } from "@/components/Header";
import { PrivacyFooter } from "@/components/PrivacyFooter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Users, Shield, Image, Code } from "lucide-react";

/**
 * About Page
 * SEO: Keyword-rich content for AI profile picture generator, background remover, etc.
 */

const useCaseCards = [
  {
    icon: Briefcase,
    // SEO: AI headshot for LinkedIn, CV, resume
    title: "LinkedIn & Professional Use",
    description: "Create AI headshots for LinkedIn, CVs, and resumes. Perfect for job seekers and professionals.",
  },
  {
    icon: Users,
    // SEO: Instagram, Bluesky, Discord profile picture maker
    title: "Social Media",
    description: "Instagram, Bluesky, and Discord profile picture maker. Stand out with a clean background.",
  },
  {
    icon: Shield,
    // SEO: Free image background remover that never uploads
    title: "Privacy-First",
    description: "A free image background remover that never uploads your photos. Everything stays on your device.",
  },
  {
    icon: Image,
    // SEO: Online profile photo editor and background changer
    title: "Any Profile Photo",
    description: "Online profile photo editor and background changer for any platform or purpose.",
  },
];

const steps = [
  { step: "1", title: "Select", description: "Choose a photo from your device" },
  { step: "2", title: "Process", description: "AI removes the background locally" },
  { step: "3", title: "Download", description: "Save your transparent PNG" },
];

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-14">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          
          {/* SEO: H1 with primary keyword */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground mb-4">
              About Private Photo Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A free AI profile picture generator that removes backgrounds while keeping your photos private.
            </p>
          </section>

          {/* What Is This Tool? */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What Is This Tool?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Private Photo Studio is a free AI headshot generator and background remover that runs entirely 
              in your browser. Unlike other tools, your photos are never uploaded to any server—all 
              processing happens locally on your device using advanced AI models.
            </p>
          </section>

          {/* Perfect For - SEO keyword grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Perfect For
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCaseCards.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-muted-foreground mb-6">
              This AI profile photo generator runs locally in your browser—no uploads, no accounts, no tracking.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map(({ step, title, description }) => (
                <div key={step} className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-3">
                    {step}
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Privacy Matters */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Why Privacy Matters
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your profile photos are personal. They contain your face, your identity. Other background 
              removal tools upload your images to remote servers, where they could be stored, analyzed, 
              or used for training AI models. Private Photo Studio keeps everything on your device—your 
              photos never leave your browser.
            </p>
          </section>

          {/* Free & Open Source */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Free & Open Source
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This project is Free and Open Source Software (FOSS), released under the MIT license. 
              You're welcome to view the source code, learn from it, and contribute improvements.
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• Free to use for personal and non-commercial purposes</li>
              <li>• Source code available on GitHub</li>
              <li>• Contributions and feedback welcome</li>
              <li>• Commercial use requires permission</li>
            </ul>
            <div className="flex flex-wrap gap-4 text-sm">
              <a 
                href="https://github.com/raoulcapello/private-photo-studio/blob/main/LICENSE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View License →
              </a>
              <a 
                href="https://github.com/raoulcapello/private-photo-studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub Repository →
              </a>
            </div>
          </section>

        </div>
      </main>
      
      <PrivacyFooter />
    </div>
  );
};

export default About;
