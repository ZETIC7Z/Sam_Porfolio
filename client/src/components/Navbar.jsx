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
  Youtube,
  Facebook,
  Volume2,
  VolumeX,
  Github,
  Shield,
  Palette,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
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
  { id: "light", name: "Light (Default)", colors: ["#7c6fd6", "#d926aa", "#f4f6f9"], isDark: false },
  { id: "dark", name: "Dark (Active)", colors: ["#8b7df0", "#d926aa", "#030712"], isDark: true },
  { id: "acid", name: "Acid", colors: ["#ff00ff", "#00ff00", "#111111"], isDark: true },
  { id: "aqua", name: "Aqua", colors: ["#09ecf3", "#966fb3", "#0b2b30"], isDark: false },
  { id: "autumn", name: "Autumn", colors: ["#8c0327", "#d85c27", "#f7f5f0"], isDark: false },
  { id: "black", name: "Black", colors: ["#000000", "#1a1a1a", "#0f0f0f"], isDark: true },
  { id: "bumblebee", name: "Bumblebee", colors: ["#e0a82e", "#f9d72f", "#ffffff"], isDark: false },
  { id: "bumblebee-dark", name: "Bumblebee Dark", colors: ["#e0a82e", "#f9d72f", "#121212"], isDark: true },
  { id: "business", name: "Business", colors: ["#1c4e80", "#0091d5", "#202020"], isDark: true },
  { id: "cmyk", name: "CMYK", colors: ["#45aeee", "#e8488a", "#ffffff"], isDark: false },
  { id: "coffee", name: "Coffee", colors: ["#db924b", "#263e3f", "#20161f"], isDark: true },
  { id: "corporate", name: "Corporate", colors: ["#4b6bfb", "#7b92b2", "#ffffff"], isDark: false },
  { id: "cupcake", name: "Cupcake", colors: ["#65c3c8", "#ef9fbc", "#faf7f5"], isDark: false },
  { id: "cyberpunk", name: "Cyberpunk", colors: ["#ff007f", "#00bfff", "#ffe100"], isDark: false },
  { id: "dim", name: "Dim", colors: ["#93c5fd", "#60a5fa", "#2a303c"], isDark: true },
  { id: "dracula", name: "Dracula", colors: ["#ff79c6", "#8be9fd", "#282a36"], isDark: true },
  { id: "emerald", name: "Emerald", colors: ["#377cfb", "#66cc8a", "#ffffff"], isDark: false },
  { id: "fantasy", name: "Fantasy", colors: ["#563b73", "#6b5b95", "#ffffff"], isDark: false },
  { id: "forest", name: "Forest", colors: ["#1eb854", "#125e29", "#171212"], isDark: true },
  { id: "garden", name: "Garden", colors: ["#5c7f67", "#ecf0e7", "#f4f4f4"], isDark: false },
  { id: "halloween", name: "Halloween", colors: ["#f28c18", "#6d3a9c", "#1a1c20"], isDark: true },
  { id: "hbo", name: "HBO Max", colors: ["#9933ff", "#00ffff", "#0b001a"], isDark: true },
  { id: "lemonade", name: "Lemonade", colors: ["#519903", "#e9ec07", "#fefefc"], isDark: false },
  { id: "lofi", name: "Lofi", colors: ["#0d0d0d", "#1a1a1a", "#ffffff"], isDark: false },
  { id: "luxury", name: "Luxury", colors: ["#ffffff", "#c5a880", "#09090b"], isDark: true },
  { id: "netflix", name: "Netflix", colors: ["#e50914", "#222222", "#141414"], isDark: true },
  { id: "night", name: "Night", colors: ["#38bdf8", "#818cf8", "#0f172a"], isDark: true },
  { id: "nord", name: "Nord", colors: ["#8fbcbb", "#88c0d0", "#2e3440"], isDark: true },
  { id: "pastel", name: "Pastel", colors: ["#d1c1d7", "#f6cbd1", "#faf7f5"], isDark: false },
  { id: "prime", name: "Prime Video", colors: ["#00a8e1", "#ff9900", "#0d1821"], isDark: true },
  { id: "retro", name: "Retro", colors: ["#ef9995", "#a4cbb4", "#ece3ca"], isDark: false },
  { id: "sunset", name: "Sunset", colors: ["#ff7e5f", "#feb47b", "#1f1c2c"], isDark: true },
  { id: "synthwave", name: "Synthwave", colors: ["#e779c1", "#58c7fa", "#1a103c"], isDark: true },
  { id: "valentine", name: "Valentine", colors: ["#e96d7b", "#a992e2", "#fae7cb"], isDark: false },
  { id: "vui", name: "Viu", colors: ["#ffc107", "#ffffff", "#111111"], isDark: true },
  { id: "wireframe", name: "Wireframe", colors: ["#b8b8b8", "#7a7a7a", "#ffffff"], isDark: false },
  { id: "winter", name: "Winter", colors: ["#1d4ed8", "#3b82f6", "#ffffff"], isDark: false }
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
    // Dispatch custom event to sync drop-down with bottom toggle
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "dark";
    applyTheme(stored);

    const handleSync = (e) => {
      applyTheme(e.detail);
    };

    window.addEventListener("theme-change", handleSync);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("theme-change", handleSync);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
          "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
          "border border-gray-200 dark:border-gray-700 shadow-sm",
          "flex items-center justify-center cursor-pointer"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Themes"
        aria-label="Themes"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-2 scrollbar-none">
          <div className="space-y-0.5">
            {themesList.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  applyTheme(t.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left",
                  activeTheme === t.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 opacity-70" />
                  <span>{t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
                </div>
                <div className="flex gap-1">
                  {t.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminButton = () => {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("admin_token");

  return (
    <motion.button
      onClick={() => navigate(hasToken ? "/dashboard" : "/admin")}
      className={cn(
        "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
        "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
        "border border-gray-200 dark:border-gray-700 shadow-sm",
        "flex items-center justify-center"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={hasToken ? "Dashboard" : "Admin Login"}
      aria-label={hasToken ? "Dashboard" : "Admin Login"}
    >
      <Shield className="w-5 h-5" />
    </motion.button>
  );
};

export const Navbar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("#hero");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const lastScrollYRef = useRef(0);
  const audioRef = useRef(null);

  const musicUrl = "/music.mp3";

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "auto";

      const handleCanPlay = () => setIsAudioReady(true);

      audioRef.current.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
          audioRef.current = null;
        }
      };
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !isAudioReady) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }

    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollYRef.current = currentScrollY;

      const sections = navItems.map((item) => item.href);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Right Buttons */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Themes Selector Button */}
        <ThemeDropdown />

        {/* GitHub Button */}
        <motion.a
          href="https://github.com/ZETIC7Z" 
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="GitHub Profile"
          aria-label="GitHub Profile"
        >
          <Github className="w-5 h-5" />
        </motion.a>

        {/* Facebook Button */}
        <motion.a
          href="https://www.facebook.com/samxerz.pangilinan/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Facebook Profile"
          aria-label="Facebook Profile"
        >
          <Facebook className="w-5 h-5" />
        </motion.a>

        {/* YouTube Button */}
        <motion.a
          href="https://www.youtube.com/@ZETICUZ"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="YouTube Channel"
          aria-label="YouTube Channel"
        >
          <Youtube className="w-5 h-5" />
        </motion.a>

        {/* Admin / Dashboard Button */}
        <AdminButton />

        {/* Music Button */}
        <motion.button
          onClick={toggleMusic}
          disabled={!isAudioReady}
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center",
            !isAudioReady && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: isAudioReady ? 1.05 : 1 }}
          whileTap={{ scale: isAudioReady ? 0.95 : 1 }}
          title={
            isAudioReady ? (isMusicPlaying ? "Pause music" : "Play music") : "Loading music..."
          }
          aria-label={
            isAudioReady ? (isMusicPlaying ? "Pause music" : "Play music") : "Loading music"
          }
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* Bottom Navbar */}
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
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
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
            ))}
            <div className="flex items-center px-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
