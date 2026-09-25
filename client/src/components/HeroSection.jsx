import { ArrowDown, MousePointerClick, Sparkles, Code, Palette, Rocket, Award, Download, Calendar, Shield, Zap, Users, TrendingUp, Briefcase, Mail } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const HeroSection = () => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");

  const codeSnippets = [
    "import { AI-First Full-Stack Engineer: } from 'zeticuz.xyz';",
    "",
    "const developer = AI-First Full-Stack Engineer:({",
    "  name: 'Sam Pangilinan',",
    "  stack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],",
    "  focus: 'Building scalable web apps & streaming platforms',",
    "  status: 'Open to new opportunities'",
    "});",
    "",
    "await developer.launchPortfolio();",
    "// Featured: Streaming PWA, Enterprise Dashboards, Gaming Portals, Community Platforms",
    "",
    "developer.connect();",
    "console.log('🚀 Let's build something exceptional together!');"
  ];

  const [projectCount, setProjectCount] = useState(5);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects?t=${Date.now()}`)
      .then(r => r.json())
      .then(d => {
        const count = d.projects?.length || 0;
        setProjectCount(count);
      })
      .catch(() => {});
  }, []);

  const achievements = [
    { number: "5+", label: "Years in Production", icon: <Shield className="h-3 w-3" /> },
    { number: `${projectCount}+`, label: "Projects Delivered", icon: <TrendingUp className="h-3 w-3" /> },
    { number: "100%", label: "Client Satisfaction", icon: <Award className="h-3 w-3" /> },
    { number: `${projectCount}+`, label: "Projects Completed", icon: <Zap className="h-3 w-3" /> }
  ];

  useEffect(() => {
    const currentLine = codeSnippets[currentCodeLine];
    if (displayedCode.length < currentLine.length) {
      setTimeout(() => {
        setDisplayedCode(currentLine.slice(0, displayedCode.length + 1));
      }, 30);
    } else {
      setTimeout(() => {
        if (currentCodeLine < codeSnippets.length - 1) {
          setCurrentCodeLine(prev => prev + 1);
          setDisplayedCode("");
        } else {
          setTimeout(() => {
            setCurrentCodeLine(0);
            setDisplayedCode("");
          }, 5000);
        }
      }, 800);
    }
  }, [displayedCode, currentCodeLine]);

  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/cv`)
      .then(res => {
        if (!res.ok) throw new Error('No CV found');
        return res.json();
      })
      .then(data => {
        if (data && data.cv && data.cv.url) {
          setCvUrl(data.cv.url);
        }
      })
      .catch(() => {
        // No CV uploaded — leave cvUrl as null
      });
  }, []);

  const handleViewResume = () => {
    // Open resume in new tab
    window.open(cvUrl || '/Sam-resume.pdf', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/10" ref={ref}>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
        </div>
        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg"
            style={{
              width: Math.random() * 60 + 20 + 'px',
              height: Math.random() * 60 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 60],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0.1, 0.25, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
        
        <motion.div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-[100px]" animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 blur-[100px]" animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, delay: 2 }} />
      </div>

      <div className="container mx-auto px-4 z-10">
        <motion.div className="flex flex-col lg:flex-row items-center justify-between gap-12" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}>
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
              <span>Currently Accepting New Opportunities</span>
            </motion.div>

            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              <span className="block text-foreground">I'm Sam Pangilinan</span>
              <motion.span 
                className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2" 
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
                style={{ backgroundSize: '200% 100%' }}
              >
                AI-First Full-Stack Engineer
              </motion.span>
            </motion.h1>

            <motion.p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              I build <span className="text-primary font-semibold">high-performance web applications</span> that drive business growth. Specializing in React, Node.js, and scalable architecture for startups and enterprises.
            </motion.p>

            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {achievement.icon}
                    <div className="text-2xl font-bold text-foreground">{achievement.number}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{achievement.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              <motion.a href="#projects" className="group relative overflow-hidden px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-3" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Code className="h-5 w-5" /> 
                <span>View Case Studies</span>
                <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a href="#contact" className="group relative overflow-hidden px-8 py-4 rounded-xl font-semibold border border-primary/50 text-foreground hover:border-primary transition-all duration-300 bg-background/80 backdrop-blur-sm text-sm flex items-center justify-center gap-3" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Mail className="h-4 w-4" /> 
                <span>Technical Interview</span>
              </motion.a>
              
              <motion.button 
                onClick={handleViewResume}
                className="group relative overflow-hidden px-6 py-4 rounded-xl font-semibold border border-border text-foreground hover:border-primary/50 transition-all duration-300 bg-background/80 backdrop-blur-sm text-sm flex items-center justify-center gap-2" 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4 text-primary" /> 
                <span>View Resume</span>
              </motion.button>
            </motion.div>

            <motion.div className="mt-6 text-center lg:text-left" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
              <div className="text-sm text-muted-foreground">
                🚀 <span className="text-primary font-semibold">Available Immediately</span> for Full-Stack and Frontend roles
              </div>
            </motion.div>
          </div>

          <motion.div className="flex-1 flex justify-center lg:justify-end w-full" variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } }}>
            {/* Expanded 3D Rotating Image Carousel — Exact CodePen abrOMLY with Floating Orb ZC Logo */}
            <div className="carousel-3d" style={{ marginTop: '0rem' }}>
              <div className="carousel-control-button left"><input type="radio" name="carousel-control-input" /></div>
              <div className="carousel-control-button right"><input type="radio" name="carousel-control-input" defaultChecked /></div>
              <div className="carousel-rotation-direction">
                <ul className="carousel-item-wrapper" style={{ '--_num-elements': 9 }}>
                  <li className="carousel-item" style={{ '--_index': 1, '--_image-url': "url('/projects/sws-portrait.png')", '--hover-color': 'rgba(6, 182, 212, 0.9)' }}>
                    <a href="https://sws-skeptrons.vercel.app" target="_blank" rel="noopener noreferrer">SWS Skeptrons</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 2, '--_image-url': "url('/projects/zetflix-portrait.png')", '--hover-color': 'rgba(239, 68, 68, 0.9)' }}>
                    <a href="https://zetflix-tv.vercel.app" target="_blank" rel="noopener noreferrer">Zetflix TV</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 3, '--_image-url': "url('/projects/nexus-portrait.png')", '--hover-color': 'rgba(168, 85, 247, 0.9)' }}>
                    <a href="https://www.zeticuz.online" target="_blank" rel="noopener noreferrer">NEXUS</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 4, '--_image-url': "url('/projects/autobiography-portrait.png')", '--hover-color': 'rgba(245, 158, 11, 0.9)' }}>
                    <a href="https://nwanganga-shields.vercel.app" target="_blank" rel="noopener noreferrer">Autobiography Website</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 5, '--_image-url': "url('/projects/dekaron-portrait.png')", '--hover-color': 'rgba(132, 204, 22, 0.9)' }}>
                    <a href="https://dekaron-stampede.vercel.app" target="_blank" rel="noopener noreferrer">Dekaron Stampede</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 6, '--_image-url': "url('/projects/careerform-portrait.png')", '--hover-color': 'rgba(59, 130, 246, 0.9)' }}>
                    <a href="https://careerform-ph.vercel.app/" target="_blank" rel="noopener noreferrer">CareerForm PH</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 7, '--_image-url': "url('/projects/lifecoach-portrait.png')", '--hover-color': 'rgba(16, 185, 129, 0.9)' }}>
                    <a href="https://lifecoachdoc.vercel.app/" target="_blank" rel="noopener noreferrer">Life Coach Portfolio</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 8, '--_image-url': "url('/projects/lifecoach2-portrait.png')", '--hover-color': 'rgba(244, 63, 94, 0.9)' }}>
                    <a href="https://lifecoachdoc2.vercel.app/" target="_blank" rel="noopener noreferrer">Life Coach v2</a>
                  </li>
                  <li className="carousel-item" style={{ '--_index': 9, '--_image-url': "url('/projects/gmcs-dashboard.vercel.app.png')", '--hover-color': 'rgba(100, 116, 139, 0.9)' }}>
                    <a href="https://gmcs-dashboard.vercel.app" target="_blank" rel="noopener noreferrer">GMCS Dashboard</a>
                  </li>
                  <li className="carousel-ground"></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator — Positioned cleanly in the dark space above About Me section */}
        <motion.div 
          className="w-full flex flex-col items-center justify-center mt-12 sm:mt-16 pb-4 relative z-20" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="#about" className="flex flex-col items-center group cursor-pointer">
            <motion.div 
              className="text-xs text-primary mb-3 flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-md border border-primary/30 shadow-lg group-hover:border-primary transition-all" 
              whileHover={{ scale: 1.05 }}
            >
              <MousePointerClick className="h-3.5 w-3.5 animate-pulse" />
              <span className="font-semibold">Explore Technical Portfolio</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 6, 0] }} 
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} 
              className="w-5 h-8 border-2 border-primary/40 rounded-full flex justify-center backdrop-blur-sm"
            >
              <motion.div 
                animate={{ y: [0, 8, 0] }} 
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} 
                className="w-1.5 h-2 bg-primary rounded-full mt-2" 
              />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
