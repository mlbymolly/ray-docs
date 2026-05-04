import React from "react";
import Navigation from "../components/ray/Navigation";
import HeroSection from "../components/ray/HeroSection";
import WhyRaySection from "../components/ray/WhyRaySection";
import ArchitectureSection from "../components/ray/ArchitectureSection";
import SchedulingSection from "../components/ray/SchedulingSection";
import ObjectStoreSection from "../components/ray/ObjectStoreSection";
import FaultToleranceSection from "../components/ray/FaultToleranceSection";
import PerformanceSection from "../components/ray/PerformanceSection";
import GCSSection from "../components/ray/GCSSection";
import LineageSection from "../components/ray/LineageSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <HeroSection />
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <img
            src="/images/ray-stack.png"
            alt="Ray stack diagram — Cloud, Ray Core, Ray AI Libraries (Data, Train, Tune, Serve, RLlib)"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      </section>
      <WhyRaySection />
      <ArchitectureSection />
      <SchedulingSection />
      <ObjectStoreSection />
      <FaultToleranceSection />
      <PerformanceSection />
      <GCSSection />
      <LineageSection />
    </div>
  );
}