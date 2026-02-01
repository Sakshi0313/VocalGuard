import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header({ onShowAnalytics }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between py-4 px-6 bg-gray-900 bg-opacity-85 text-white shadow-md">
      <h1 className="text-3xl font-bold">VocalGuard</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-4">
        <NavLink href="#how">How It Works</NavLink>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#try">Try Demo</NavLink>
        {/* 🔹 Call parent function on click */}
        <button
          onClick={onShowAnalytics}
          className="p-2 font-medium rounded transition duration-300 hover:text-green-400 hover:shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e]"
        >
          Analytics
        </button>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white flex flex-col items-center py-4 space-y-2 md:hidden shadow-lg z-40">
          <NavLink href="#how" onClick={() => setMenuOpen(false)}>How It Works</NavLink>
          <NavLink href="#features" onClick={() => setMenuOpen(false)}>Features</NavLink>
          <NavLink href="#try" onClick={() => setMenuOpen(false)}>Try Demo</NavLink>
          <button
            onClick={() => {
              onShowAnalytics();
              setMenuOpen(false);
            }}
            className="p-2 font-medium rounded transition duration-300 hover:text-green-400"
          >
            Analytics
          </button>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="p-2 font-medium rounded transition duration-300 hover:text-green-400 hover:shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e]"
    >
      {children}
    </a>
  );
}
