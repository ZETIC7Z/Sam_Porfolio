import { useEffect, useState, useRef } from "react";
import {
  Home,
  User,
  Code,
  Briefcase,
  MessageSquare,
  Mail,
  BookOpen,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Shield,
  Palette,
  Check,
  Lock,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Skills", href: "#skills", icon: Code },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Testimonials", href: "#testimonials", icon: MessageSquare },
  { name: "Contact", href: "#contact", icon: Mail },
  { name: "Blog", href: "https://github.com/ZETIC7Z", icon: BookOpen },
];


const themesList = [
  /* ── Custom portfolio themes ── */
  { id: "dark",        name: "Dark (Default)",  colors: ["#8b7df0","#d926aa","#030712"],   isDark: true  },
  { id: "light",       name: "Light",           colors: ["#7c6fd6","#d926aa","#f4f6f9"],   isDark: false },
  { id: "bumblebee-dark", name: "Bumblebee Dark",colors: ["#e0a82e","#f9d72f","#121212"],  isDark: true  },
  { id: "netflix",     name: "Netflix",          colors: ["#e50914","#222222","#141414"],   isDark: true  },
  { id: "hbo",         name: "HBO Max",          colors: ["#9933ff","#00ffff","#0b001a"],   isDark: true  },
  { id: "prime",       name: "Prime Video",      colors: ["#00a8e1","#ff9900","#0d1821"],   isDark: true  },
  { id: "vui",         name: "VIU Dark",         colors: ["#ffc107","#252525","#111111"],   isDark: true  },
  { id: "cmyk-dark",   name: "CMYK Dark",        colors: ["#45aeee","#e8488a","#121212"],   isDark: true  },
  { id: "autumn-dark", name: "Autumn Dark",      colors: ["#d85c27","#8c0327","#140e0c"],   isDark: true  },
  { id: "garden-dark", name: "Garden Dark",      colors: ["#5c7f67","#2e4034","#121814"],   isDark: true  },
  /* ── DaisyUI v5 standard themes ── */
  { id: "acid",        name: "Acid",             colors: ["#ff00ff","#00ff00","#111111"],   isDark: true  },
  { id: "aqua",        name: "Aqua",             colors: ["#09ecf3","#966fb3","#0b2b30"],   isDark: false },
  { id: "autumn",      name: "Autumn",           colors: ["#8c0327","#d85c27","#f0e6d3"],   isDark: false },
  { id: "black",       name: "Black",            colors: ["#373737","#373737","#000000"],   isDark: true  },
  { id: "bumblebee",   name: "Bumblebee",        colors: ["#e0a82e","#181830","#ffffff"],   isDark: false },
  { id: "business",    name: "Business",         colors: ["#1c4f82","#7b92b2","#1d232a"],   isDark: true  },
  { id: "cmyk",        name: "CMYK",             colors: ["#45aeee","#e8488a","#ffffff"],   isDark: false },
  { id: "coffee",      name: "Coffee",           colors: ["#db924b","#263e3f","#20161f"],   isDark: true  },
  { id: "corporate",   name: "Corporate",        colors: ["#4b6bfb","#7b92b2","#ffffff"],   isDark: false },
  { id: "cupcake",     name: "Cupcake",          colors: ["#65c3c8","#ef9fbc","#faf7f5"],   isDark: false },
  { id: "cyberpunk",   name: "Cyberpunk",        colors: ["#ff007f","#00bfff","#ffe100"],   isDark: false },
  { id: "dim",         name: "Dim",              colors: ["#9ce99e","#9ce99e","#2a303c"],   isDark: true  },
  { id: "dracula",     name: "Dracula",          colors: ["#ff79c6","#bd93f9","#282a36"],   isDark: true  },
  { id: "emerald",     name: "Emerald",          colors: ["#66cc8a","#377cfb","#ffffff"],   isDark: false },
  { id: "fantasy",     name: "Fantasy",          colors: ["#6e0b75","#007ebd","#ffffff"],   isDark: false },
  { id: "forest",      name: "Forest",           colors: ["#1eb854","#1db88e","#171212"],   isDark: true  },
  { id: "garden",      name: "Garden",           colors: ["#5c7f67","#ecf4e7","#e9e7e7"],   isDark: false },
  { id: "halloween",   name: "Halloween",        colors: ["#f28c18","#6d0076","#212121"],   isDark: true  },
  { id: "lemonade",    name: "Lemonade",         colors: ["#519903","#e9e92f","#ffffff"],   isDark: false },
  { id: "lofi",        name: "Lo-Fi",            colors: ["#0d0d0d","#1a1a1a","#ffffff"],   isDark: false },
  { id: "luxury",      name: "Luxury",           colors: ["#dca54c","#ffffff","#090d16"],   isDark: true  },
  { id: "night",       name: "Night",            colors: ["#38bdf8","#818cf8","#0f1729"],   isDark: true  },
  { id: "nord",        name: "Nord",             colors: ["#5e81ac","#81a1c1","#eceff4"],   isDark: false },
  { id: "pastel",      name: "Pastel",           colors: ["#d1c1d7","#f6cbd1","#ffffff"],   isDark: false },
  { id: "retro",       name: "Retro",            colors: ["#ef9995","#a4cbb4","#e4d8b4"],   isDark: false },
  { id: "sunset",      name: "Sunset",           colors: ["#ff865b","#fd6f9c","#1d1d2e"],   isDark: true  },
  { id: "synthwave",   name: "Synthwave",        colors: ["#e779c1","#58c7f3","#1a103c"],   isDark: true  },
  { id: "valentine",   name: "Valentine",        colors: ["#e96d7b","#a991f7","#e9e7e7"],   isDark: false },
  { id: "winter",      name: "Winter",           colors: ["#047aed","#463aa2","#ffffff"],   isDark: false },
  { id: "wireframe",   name: "Wireframe",        colors: ["#b8b8b8","#000000","#ffffff"],   isDark: false },
];



const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const updateIconState = (tId) => {
      const activeObj = themesList.find(t => t.id === tId);
      setTheme(activeObj ? (activeObj.isDark ? "dark" : "light") : "dark");
    };

    const stored = localStorage.getItem("theme") || "dark";
    updateIconState(stored);

    const handleSync = (e) => {
      updateIconState(e.detail);
    };

    window.addEventListener("theme-change", handleSync);
    return () => {
      window.removeEventListener("theme-change", handleSync);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
    </button>
  );
};

const ThemeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("dark");
  const dropdownRef = useRef(null);

  const applyTheme = (themeId) => {
    const theme = themesList.find(t => t.id === themeId) || themesList[1];
    document.documentElement.setAttribute("data-theme", theme.id);
    if (theme.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme.id);
    setActiveTheme(theme.id);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: theme.id }));
  };

  useEffect(() => {
    // Restore saved theme on mount
    const saved = localStorage.getItem("theme") || "dark";
    setActiveTheme(saved);
    // Re-apply to ensure data-theme is correct (in case of HMR / stale state)
    const t = themesList.find(th => th.id === saved);
    if (t) {
      document.documentElement.setAttribute("data-theme", t.id);
      if (t.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-header-glow theme-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        title="Change Theme Palette"
        aria-label="Change Theme Palette"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 max-h-80 overflow-y-auto bg-slate-950/90 border border-amber-500/30 rounded-2xl shadow-2xl z-50 p-2 backdrop-blur-xl"
          >
            <div className="space-y-1">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    applyTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-left",
                    activeTheme === t.id
                      ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40"
                      : "text-zinc-300 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 opacity-80 text-amber-400" />
                    <span>{t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
                  </div>
                  <div className="flex gap-1">
                    {t.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminButton = () => {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("admin_token");

  return (
    <motion.button
      onClick={() => navigate(hasToken ? "/dashboard" : "/admin")}
      className="btn-header-glow admin-glow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      title={hasToken ? "Admin Dashboard" : "Admin Login"}
      aria-label={hasToken ? "Admin Dashboard" : "Admin Login"}
    >
      {hasToken ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
    </motion.button>
  );
};

/* =============================================================
   VOLUME CONTROL WITH AUTO-SLIDING POPUP (CodePen gbOdEGw)
   ============================================================= */
const VolumeControl = () => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hideTimerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!window.__GLOBAL_AUDIO__) {
      window.__GLOBAL_AUDIO__ = new Audio("/music.mp3");
      window.__GLOBAL_AUDIO__.loop = true;
      window.__GLOBAL_AUDIO__.volume = 0.8;
    }

    audioRef.current = window.__GLOBAL_AUDIO__;

    const syncState = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setIsPlaying(true);
        setIsMuted(false);
        setVolume(Math.round(audioRef.current.volume * 100) || 80);
      }
    };

    syncState();

    if (window.__AUTOPLAY_AUDIO__) {
      audioRef.current.volume = 0.8;
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        setVolume(80);
      }).catch(console.error);
      delete window.__AUTOPLAY_AUDIO__;
    }

    const handleAudioStarted = (e) => {
      const vol = e.detail?.volume ?? 0.8;
      setIsPlaying(true);
      setIsMuted(false);
      setVolume(Math.round(vol * 100));
    };

    window.addEventListener("portfolio:audioStarted", handleAudioStarted);

    return () => {
      window.removeEventListener("portfolio:audioStarted", handleAudioStarted);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const startAutoSlideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const togglePlayMute = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    if (isMuted || volume === 0) {
      const newVol = volume === 0 ? 50 : volume;
      setVolume(newVol);
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = newVol / 100;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }

    setIsOpen(true);
    startAutoSlideTimer();
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume = val / 100;
      if (!isPlaying && val > 0) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
    startAutoSlideTimer();
  };

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="relative" ref={popupRef}>
      <motion.button
        onClick={togglePlayMute}
        className="btn-header-glow volume-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        title={displayVolume === 0 ? "Muted (0%)" : `Volume ${displayVolume}%`}
        aria-label="Volume Control"
      >
        {displayVolume === 0 ? (
          <VolumeX className="w-5 h-5 text-emerald-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-emerald-400" />
        )}
      </motion.button>

      {/* Slide-in Volume Adjuster Popup Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onMouseEnter={() => {
              if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            }}
            onMouseLeave={startAutoSlideTimer}
            className="volume-adjuster-panel"
          >
            <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="range"
              id="volume-slider"
              name="volume"
              aria-label="Volume level slider"
              min="0"
              max="100"
              value={displayVolume}
              onChange={handleVolumeChange}
              className="w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <span className="text-xs font-bold text-emerald-400 min-w-[28px] text-right font-mono">
              {displayVolume}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("#hero");
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const scrollStopTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      // Automatically show navbar when user stops scrolling down
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      scrollStopTimerRef.current = setTimeout(() => {
        setShowNavbar(true);
      }, 900);

      lastScrollYRef.current = currentScrollY;

      const sections = navItems.map((item) => item.href).filter((href) => typeof href === 'string' && href.startsWith('#'));
      const scrollPosition = currentScrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* Top Right Header Action Trio: Theme, Volume & Admin Login */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Theme Palette Glow Selector */}
        <ThemeDropdown />

        {/* Volume Adjuster with Auto-Slide */}
        <VolumeControl />

        {/* Admin Login / Dashboard Button */}
        <AdminButton />
      </motion.div>

      {/* Bottom Floating Navigation Bar */}
      <motion.div
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
          "transition-transform duration-300 ease-in-out",
          showNavbar ? "translate-y-0" : "translate-y-full"
        )}
        style={{ willChange: "transform" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 items-center">
            {navItems.map((item) => {
              const isExternal = typeof item.href === "string" && item.href.startsWith("http");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={cn(
                    "p-2 rounded-full transition-colors flex flex-col items-center",
                    activeSection === item.href
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  )}
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1 hidden md:block">{item.name}</span>
                </a>
              );
            })}
            <div className="flex items-center px-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
