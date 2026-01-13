import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/github', label: 'GitHub' },
  { href: '/videos', label: 'Videos' },
  { href: '/contact', label: 'Contact' },
];

const THEME_STORAGE_KEY = 'theme';

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  });
  const location = useLocation();
  const handleNavClick = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container-wide">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-heading text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              Mark Hazleton
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleNavClick}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="ml-2"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={handleNavClick}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === link.href
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container-wide py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {/* About */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-3">Mark Hazleton</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Technical Solutions Architect helping teams build resilient, 
                scalable systems. Writing about cloud architecture, integration 
                patterns, and engineering practices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      onClick={handleNavClick}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-3">Stay Connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Occasional thoughts on architecture and engineering.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/markhazleton"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/markhazleton"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              Mark Hazleton. Built with curiosity and caffeine.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
