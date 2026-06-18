import React, { Suspense, lazy } from "react";
import { Navbar } from "../components/Navbar";
import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";

const SkillsSection = lazy(() => import("../components/SkillsSection"));
const ProjectsSection = lazy(() => import("../components/ProjectsSection"));
const ContactSection = lazy(() => import("../components/ContactSection"));
const TestimonialSection = lazy(() => import("../components/Testimonial"));

const LoadingSpinner = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Theme Toggle */}
      {/* Background Effects */}
      <StarBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <Suspense fallback={<LoadingSpinner />}>
          <SkillsSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <TestimonialSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ContactSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};