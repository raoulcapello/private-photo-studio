import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

/**
 * Navigation Header
 * SEO: Provides clear site structure and internal linking
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <nav className="container mx-auto flex items-center justify-between h-14 px-4 overflow-hidden">
        {/* Logo / App Name */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          <img src="/logo-icon.png" alt="" className="h-16 w-16 object-contain" aria-hidden="true" />
          Private Photo Studio
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground font-medium"
            end
          >
            Editor
          </NavLink>
          <NavLink
            to="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground font-medium"
          >
            About
          </NavLink>
        </div>

        {/* Mobile Hamburger Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              <NavLink
                to="/"
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground font-medium"
                end
                onClick={() => setOpen(false)}
              >
                Editor
              </NavLink>
              <NavLink
                to="/about"
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground font-medium"
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
