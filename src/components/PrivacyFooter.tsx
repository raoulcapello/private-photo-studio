import { Lock } from "lucide-react";

export function PrivacyFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 py-10 text-center">
        <Lock className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The AI model runs entirely in your browser. Your images never leave
          your device—no cookies, no analytics, no external requests beyond
          loading the app itself.
        </p>
      </div>
    </footer>
  );
}
