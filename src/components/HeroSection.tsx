import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, WifiOff, Cpu } from "lucide-react";

interface HeroSectionProps {
  onFileSelect: (file: File) => void;
}

const privacyBadges = [
  { icon: WifiOff, label: "No uploads" },
  { icon: Shield, label: "No tracking" },
  { icon: Cpu, label: "Runs locally" },
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
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
        Remove backgrounds.{" "}
        <span className="text-primary">Keep photos private.</span>
      </h1>

      <p className="max-w-lg text-lg text-muted-foreground">
        All processing happens in your browser—nothing is uploaded.
      </p>

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
    </section>
  );
}
