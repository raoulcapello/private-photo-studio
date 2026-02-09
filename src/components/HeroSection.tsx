import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, WifiOff, Cpu, Briefcase, Users, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onFileSelect: (file: File) => void;
}

const privacyBadges = [
  { icon: WifiOff, label: "No uploads" },
  { icon: Shield, label: "No tracking" },
  { icon: Cpu, label: "Runs locally" },
];

/**
 * Use Cases Grid
 * SEO: Naturally incorporates keywords for LinkedIn, social media, AI-powered
 */
const useCases = [
  {
    icon: Briefcase,
    // SEO: Professional profile photo AI, LinkedIn profile picture
    heading: "Professional Headshots",
    description: "Perfect for LinkedIn, CVs, and resumes",
  },
  {
    icon: Users,
    // SEO: Instagram, Discord, Bluesky profile picture maker
    heading: "Social Media",
    description: "Ready for Instagram, Discord, Bluesky",
  },
  {
    icon: Sparkles,
    // SEO: AI headshot generator
    heading: "AI-Powered",
    description: "Fast, accurate background removal",
  },
];

export function HeroSection({ onFileSelect }: HeroSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <section className="flex flex-col items-center gap-8 px-4 pt-24 pb-16 text-center">
      <img src="/logo-icon.png" alt="Private Photo Studio" className="h-20 w-20 object-contain" />
      {/* SEO: H1 with primary keyword - AI profile picture background remover */}
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
        Free AI Profile Picture{" "}
        <span className="text-primary">Background Remover</span>
      </h1>

      {/* SEO: Tagline with LinkedIn, CVs, social media keywords */}
      <p className="max-w-lg text-lg text-muted-foreground">
        Create professional headshots for LinkedIn, CVs, and social media—100% private.
      </p>

      {/* Privacy trust signals */}
      <div className="flex flex-wrap justify-center gap-3">
        {privacyBadges.map(({ icon: Icon, label }) => (
          <Badge
            key={label}
            variant="secondary"
            className="gap-1.5 px-3 py-1.5 text-sm font-medium"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Badge>
        ))}
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="mt-2 text-base px-8"
        onClick={() => inputRef.current?.click()}
      >
        Select a photo
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* SEO: Use Cases grid - incorporates long-tail keywords */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3 max-w-2xl w-full">
        {useCases.map(({ icon: Icon, heading, description }) => (
          <div key={heading} className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 rounded-xl bg-secondary">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-medium text-foreground">{heading}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      {/* Subtext - processing info */}
      <p className="text-sm text-muted-foreground mt-4">
        All processing happens in your browser. Nothing is uploaded.
      </p>
    </section>
  );
}
