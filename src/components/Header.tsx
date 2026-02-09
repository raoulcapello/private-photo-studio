import { NavLink } from "@/components/NavLink";

/**
 * Navigation Header
 * SEO: Provides clear site structure and internal linking
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <nav className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo / App Name */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          <img src="/logo-icon.png" alt="" className="h-16 w-16 object-contain" aria-hidden="true" />
          Private Photo Studio
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
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
      </nav>
    </header>
  );
}
