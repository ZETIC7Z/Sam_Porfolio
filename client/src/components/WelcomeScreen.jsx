import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

const WelcomeScreen = ({ onWelcomeComplete }) => {
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          const svgEl = document.querySelector(".vi-svg-loader");
          if (svgEl) svgEl.remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main-gtavi", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: -1,
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: 1.0,
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.0,
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "Expo.easeInOut",
    });

    gsap.to(".character", {
      scale: 1.05,
      x: "-50%",
      bottom: "6%",
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "Expo.easeInOut",
    });

    gsap.to(".text-gta", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: -0.8,
      ease: "Expo.easeInOut",
    });

    const main = document.querySelector(".main-gtavi");
    if (!main) return;

    const handleMouseMove = (e) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      const yMove = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".main-gtavi .text-gta", {
        x: `${xMove * 0.4}%`,
        y: `${yMove * 0.2}%`,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(".sky", {
        x: xMove,
        y: yMove * 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
        y: yMove * 1.2,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(".character", {
        x: `calc(-50% + ${xMove * 0.8}px)`,
        y: yMove * 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    main.addEventListener("mousemove", handleMouseMove);
    return () => {
      main.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showContent]);

  const handleEnterSite = () => {
    try {
      if (!window.__GLOBAL_AUDIO__) {
        window.__GLOBAL_AUDIO__ = new Audio("/music.mp3");
        window.__GLOBAL_AUDIO__.loop = true;
      }
      window.__GLOBAL_AUDIO__.volume = 0.8;
      window.__GLOBAL_AUDIO__.muted = false;
      window.__GLOBAL_AUDIO__.play().then(() => {
        window.dispatchEvent(new CustomEvent("portfolio:audioStarted", { detail: { volume: 0.8 } }));
      }).catch((err) => console.log("Audio play error:", err));
    } catch (e) {
      console.error("Audio init error:", e);
    }

    window.__AUTOPLAY_AUDIO__ = true;
    if (onWelcomeComplete) {
      onWelcomeComplete();
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden bg-black text-white font-sans select-none">
      {/* Intro Mask Animation */}
      <div className="vi-svg-loader flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black, Impact, sans-serif"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>

      {/* Main 3D Parallax Stage */}
      {showContent && (
        <div className="main-gtavi w-full rotate-[-10deg] scale-[1.0]">
          {/* Top 3D Parallax Landing Section */}
          <div className="landing overflow-hidden relative w-full h-screen bg-black">
            {/* Top Navigation */}
            <div className="navbar absolute top-0 left-0 z-[20] w-full py-10 px-10">
              <div className="logo flex gap-7 items-center">
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-15 h-2 bg-white"></div>
                  <div className="line w-8 h-2 bg-white"></div>
                  <div className="line w-5 h-2 bg-white"></div>
                </div>
                <h3 className="text-4xl -mt-[8px] leading-none text-white font-bold">
                  ZETICUZ
                </h3>
              </div>
            </div>

            {/* 3D Layers Container */}
            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              {/* Layer 1: Sky (Fully unzoomed 1.0x scale) */}
              <img
                className="absolute sky scale-[1.0] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="/sky.png"
                alt="Sky"
              />
              
              {/* Layer 2: City Backdrop (Fully unzoomed 1.0x scale to display full city background view) */}
              <img
                className="absolute scale-[1.0] rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
                src="/bg.png"
                alt="City Backdrop"
              />

              {/* Layer 3: Grand Theft Auto 3D Text (Shifted up to top-10 so 'auto' is fully readable) */}
              <div className="text-gta text-white flex flex-col gap-3 absolute top-10 left-1/2 -translate-x-1/2 scale-[1.4] rotate-[-10deg] pointer-events-none select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <h1 className="text-[12rem] leading-none -ml-40 font-black tracking-tighter">grand</h1>
                <h1 className="text-[12rem] leading-none ml-20 font-black tracking-tighter">theft</h1>
                <h1 className="text-[12rem] leading-none -ml-40 font-black tracking-tighter">auto</h1>
              </div>

              {/* Layer 4: Main Character Overlay — Positioned on left (32%) with exact proportioned body, tattoos, and waist gun */}
              <img
                className="absolute character -bottom-[80%] left-[32%] -translate-x-1/2 scale-[1.8] rotate-[-20deg] h-[80vh] max-h-[680px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                src="/girlbg.png"
                alt="Main Character"
              />
            </div>

            {/* Bottom Bar: Left Scroll Down, Center PS5, Right ENTER SITE Button */}
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-10 px-10 bg-gradient-to-t from-black via-black/80 to-transparent z-[30] flex items-center justify-between">
              
              {/* Left Side: Scroll Down Indicator */}
              <div className="flex gap-4 items-center">
                <i className="text-4xl ri-arrow-down-line"></i>
                <h3 className="text-xl font-[Helvetica_Now_Display]">
                  Scroll Down
                </h3>
              </div>

              {/* Center: PS5 / Xbox Badges */}
              <img
                className="hidden sm:block h-[55px] object-contain"
                src="/ps5.png"
                alt="PS5 / Xbox"
              />

              {/* Right Side: ENTER SITE Button */}
              <button
                onClick={handleEnterSite}
                className="px-8 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl tracking-wider uppercase border-2 border-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
              >
                <span>ENTER SITE</span>
                <i className="ri-arrow-right-line text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Scrollable Content Section Below Landing Page */}
          <div className="w-full h-screen flex items-center justify-center bg-black">
            <div className="cntnr flex flex-col md:flex-row text-white w-full h-[80%] px-10 gap-10 items-center justify-center">
              <div className="limg relative w-full md:w-1/2 h-full flex items-center justify-center">
                <img
                  className="scale-[1.1] max-h-[80%] object-contain"
                  src="/welcome-section.png"
                  alt="ZETICUZ Portfolio"
                />
              </div>
              <div className="rg w-full md:w-[40%] py-10 flex flex-col justify-center">
                <h1 className="text-6xl lg:text-7xl font-bold">Still Running,</h1>
                <h1 className="text-6xl lg:text-7xl font-bold text-yellow-500">Not Hunting</h1>
                <p className="mt-6 text-lg text-gray-300 font-[Helvetica_Now_Display] leading-relaxed">
                  Welcome to the ultimate interactive 3D portfolio experience. Built with cutting-edge web technologies, high performance animations, and seamless audio integration.
                </p>
                <p className="mt-3 text-lg text-gray-400 font-[Helvetica_Now_Display] leading-relaxed">
                  Explore full-stack applications, enterprise dashboards, streaming PWAs, and custom interactive digital experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
