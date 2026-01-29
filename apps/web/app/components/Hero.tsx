import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Paper strip between vertical lines (1280px = same as line spacing) */}
      <div className="relative overflow-hidden bg-[#F4F4F4] w-full max-w-[1280px] mx-auto min-h-[calc(100vh-5rem)] flex items-center justify-center py-12">
        <div
          className="absolute -inset-[20px] z-0 bg-[#F4F4F4] bg-[url('/images/paper_airplane_send_with_dotted_lines.jpg')] bg-center bg-no-repeat [background-size:90%]"
          aria-hidden
        />
        <div
          className="relative z-10 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden flex justify-center items-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "1px solid #E8E8E8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="max-w-6xl mx-auto text-center px-10 sm:px-16 py-24 md:py-40 w-full">
            <h1 className="font-cal-sand text-4xl md:text-6xl font-medium text-black leading-tight mb-4 tracking-tight">
              Turn{" "}
              <span className="font-normal tracking-normal">
                Market Volatility
              </span>{" "}
              into <br /> Opportunity with MarginX
            </h1>

            <p className="text-sm md:text-base text-black mb-8 max-w-3xl mx-auto leading-relaxed font-inter">
              Step into the world of limitless opportunities with a trusted
              broker. A global reach to give you the confidence to trade smarter
              and scale faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/marketplace">
                <Button
                  size="default"
                  className="text-[15px] px-8 py-2.5 rounded-2xl w-full sm:w-auto"
                >
                  Let&apos;s trade
                </Button>
              </Link>
              <Link
                href="/docs"
                className="text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
