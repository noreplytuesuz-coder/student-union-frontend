import { Instagram, MessageCircle, Twitter } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { BackToTop } from "@/widgets/back-to-top";
import { BottomNav } from "@/widgets/bottom-nav";
import { Navbar } from "@/widgets/navbar";

export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient background blobs */}
      <div className="fixed -left-[10%] -top-[20%] -z-10 h-[50%] w-[50%] animate-pulse rounded-full bg-primary/20 blur-[120px]" />
      <div
        className="fixed -right-[10%] -bottom-[20%] -z-10 h-[50%] w-[50%] animate-pulse rounded-full bg-secondary/20 blur-[120px]"
        style={{ animationDelay: "2s" }}
      />

      <Navbar />

      <main className="flex-1 pb-24 pt-32 md:pb-16">
        <Outlet />
      </main>

      <footer className="relative overflow-hidden bg-[var(--color-bg-dark)] pb-28 pt-24 text-white md:pb-12">
        <div className="absolute left-0 top-0 h-8 w-full bg-gradient-hero" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="neo-border -rotate-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img loading="lazy" src="/logo.jpg" alt="Student Union Logo" className="h-full w-full object-cover" />
                </div>
                <h3 className="font-display text-4xl font-bold">
                  STUDENT <span className="text-secondary">UNION</span>
                </h3>
              </div>
              <p className="max-w-md font-sans text-gray-400">
                The most alive, energetic, and modern student union platform. Built for the next generation of campus
                leaders.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-heading text-lg font-bold text-cyan-400">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/documents" className="transition-colors hover:text-white">
                    Documents
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="transition-colors hover:text-white">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-heading text-lg font-bold text-yellow-400">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/join" className="transition-colors hover:text-white">
                    Join Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Student Union. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-secondary"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Discord"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-yellow"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
      <BackToTop />
    </div>
  );
}
