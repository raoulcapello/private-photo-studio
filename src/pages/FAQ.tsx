import { Header } from "@/components/Header";
import { PrivacyFooter } from "@/components/PrivacyFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * FAQ Page
 * Provides answers to common questions about the app, privacy, performance,
 * and platform differences. Content migrated from About page where appropriate.
 * SEO: Targets long-tail queries like "free background remover privacy", "AI photo editor slow", etc.
 */

const faqItems = [
  {
    id: "free",
    question: "Why is this app free?",
    answer: (
      <>
        <p className="mb-3">
          It's a tool I wanted for myself, so I built it and decided to share it
          with the world.
        </p>
        <p className="mb-3">
          It also serves as a showcase of my work as a software architect and
          developer.
        </p>
        <p className="mb-3">
          If you like the app, please consider supporting me with a{" "}
          <a
            href="https://liberapay.com/raoul/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            donation
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    question: "Is my photo uploaded anywhere?",
    answer: (
      <p>
        No. All processing happens in your browser using a local AI model. Your
        images never leave your device—no uploads, no cookies, no tracking.
      </p>
    ),
  },
  {
    id: "accuracy",
    question: "Why didn't the background removal work perfectly on my photo?",
    answer: (
      <>
        <p className="mb-3">
          The AI model doesn't handle all images equally well. Results depend on
          lighting, contrast between subject and background, and image clarity.
          Photos with clear edges and good lighting produce the best results.
        </p>
        <p>
          You can use the eraser brush (available on desktop) to manually clean
          up remaining artifacts.
        </p>
      </>
    ),
  },
  {
    id: "mobile",
    question: "Does it work on my phone?",
    answer: (
      <>
        <p className="mb-3">
          Yes, background removal works on all devices. However, some editing
          features are only available on desktop browsers:
        </p>
        <ul className="space-y-2 mb-3">
          <li>
            • <strong className="text-foreground">Eraser brush:</strong>{" "}
            Available on desktop only. Lets you manually clean up leftover
            artifacts by painting them transparent.
          </li>
          <li>
            • <strong className="text-foreground">Custom color picker:</strong>{" "}
            The eyedropper tool depends on browser support and works best on
            desktop.
          </li>
          <li>
            • <strong className="text-foreground">Preset backgrounds:</strong>{" "}
            Transparent, white, gray, and navy options work on all devices.
          </li>
        </ul>
        <p>
          On mobile, the app uses a slower but more compatible processing mode
          (WASM instead of WebGPU). For the best editing experience, we
          recommend using a desktop browser.
        </p>
      </>
    ),
  },
  {
    id: "slow",
    question: "Why is processing slow on my device?",
    answer: (
      <>
        <p className="mb-3">
          The AI model runs entirely in your browser, so speed depends on your
          device's hardware. Desktop computers with modern GPUs process images
          fastest via WebGPU. Mobile devices and older computers fall back to
          CPU-based processing (WASM), which is slower but works reliably.
        </p>
        <p>
          The model also needs to be downloaded once on first use (~40 MB),
          which may take a moment on slower connections.
        </p>
      </>
    ),
  },
  {
    id: "formats",
    question: "What image formats are supported?",
    answer: (
      <p>
        You can select any common image format (JPEG, PNG, WebP, etc.). The
        result is always downloaded as a transparent PNG.
      </p>
    ),
  },
  {
    id: "commercial",
    question: "Can I use this for commercial purposes?",
    answer: (
      <>
        <p className="mb-3">
          The app code is MIT-licensed, but the underlying AI model (
          <a
            href="https://huggingface.co/briaai/RMBG-1.4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            RMBG-1.4 by BRIA AI
          </a>
          ) has its own license terms. Check the{" "}
          <a
            href="https://huggingface.co/briaai/RMBG-1.4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            model's license
          </a>{" "}
          for commercial use.
        </p>
        <p>The app itself is free for personal and non-commercial use.</p>
      </>
    ),
  },
  {
    id: "feedback",
    question: "Are you open to feedback and suggestions?",
    answer: (
      <>
        <p className="mb-3">
          Yes, very much so! If you have a feature request, bug report, or
          suggestion, the best place to share it is on{" "}
          <a
            href="https://github.com/raoulcapello/private-photo-studio/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub Issues
          </a>
          .
        </p>
        <p>
          You can also reach me directly via{" "}
          <a
            href="mailto:raoul@raoulcapello.nl"
            className="text-primary hover:underline"
          >
            email
          </a>{" "}
          or my{" "}
          <a
            href="https://raoulcapello.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            website
          </a>
          .
        </p>
      </>
    ),
  },
];

const FAQ = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-14">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          {/* SEO: H1 with target keywords */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about privacy, performance, and how the app
              works.
            </p>
          </section>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(({ id, question, answer }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="text-left text-base">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <PrivacyFooter />
    </div>
  );
};

export default FAQ;
