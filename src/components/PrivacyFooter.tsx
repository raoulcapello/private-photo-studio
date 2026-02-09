import { Lock, Heart, Mail, Github, User } from "lucide-react";

export function PrivacyFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-10 text-center">
        {/* Privacy Section */}
        <div className="flex flex-col items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            The AI model runs entirely in your browser. Your images never leave
            your device—no cookies, no analytics, no external requests beyond
            loading the app itself.
          </p>
        </div>

        {/* Model Attribution */}
        <p className="text-xs text-muted-foreground">
          Model by{" "}
          <a
            href="https://huggingface.co/briaai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            BRIA AI
          </a>
        </p>


        {/* Support & Feedback */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <a
            href="https://liberapay.com/raoul/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
          >
            <Heart className="h-3.5 w-3.5" />
            Support development
          </a>
          <a
            href="https://github.com/raoulcapello/private-photo-studio/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Feedback welcome
          </a>
          <a
            href="https://github.com/raoulcapello/private-photo-studio/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            Source code
          </a>
          <a
            href="https://www.raoulcapello.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            About the developer
          </a>
        </div>
      </div>
    </footer>
  );
}
