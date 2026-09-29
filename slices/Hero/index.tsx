"use client";

import { FC, Suspense } from "react";
import { asText, Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Bounded } from "@/components/layout/Bounded";
import { TextSplitter } from "@/components/ui/TextSplitter";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const ready = useStore((state) => state.ready);

  useGSAP(
    () => {
      if (!ready) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const introTl = gsap.timeline();

        introTl
          .set(".hero", { opacity: 1 })
          .from(".hero-header-word", {
            scale: 3,
            opacity: 0,
            ease: "power4.in",
            delay: 0.3,
            stagger: 1,
          })
          .from(
            ".hero-subheading",
            {
              y: 30,
              opacity: 0,
            },
            "+=.8"
          )
          .from(".hero-body", {
            y: 10,
            opacity: 0,
          })
          .from(".hero-button", {
            y: 10,
            opacity: 0,
            duration: 0.6,
          });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        scrollTl
          .fromTo(
            "body",
            { backgroundColor: "hsl(50.44, 97.85%, 63.53%)" },
            { backgroundColor: "hsl(80.87, 88.46%, 79.61%)", overwrite: "auto" },
            1
          )
          .from(".text-side-heading .split-char", {
            scale: 1.3,
            y: 40,
            rotate: -25,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(3)",
            duration: 0.5,
          })
          .from(".text-side-body", {
            y: 20,
            opacity: 0,
          });
      });
    },
    { dependencies: [ready] }
  );

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero md:opacity-0"
    >
      <div className="hero-scene pointer-events-none sticky top-0 z-50 mt-[-100vh] hidden h-screen w-screen md:block">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <div className="grid">
        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header text-7xl leading-[.8] font-black text-orange-500 uppercase md:text-[9rem] lg:text-[13rem]">
              <TextSplitter
                text={asText(slice.primary.heading)}
                wordDisplayStyle="block"
                className="hero-header-word"
              />
            </h1>
            <div className="hero-subheading mt-12 text-5xl font-semibold text-sky-950 lg:text-6xl">
              <PrismicRichText field={slice.primary.subheading} />
            </div>

            <div className="hero-body text-2xl font-normal text-sky-950">
              <PrismicRichText field={slice.primary.body} />
            </div>

            {isFilled.link(slice.primary.button_link) && "filled"}

            {isFilled.link(slice.primary.button_link) ? (
              <PrismicNextLink
                field={slice.primary.button_link}
                className={cn(
                  "rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold tracking-wide uppercase transition-colors duration-150 hover:bg-orange-700 md:text-2xl",
                  "hero-button mt-12"
                )}
              ></PrismicNextLink>
            ) : (
              <a
                href={"#flavors"}
                className={cn(
                  "rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold tracking-wide uppercase transition-colors duration-150 hover:bg-orange-700 md:text-2xl",
                  "hero-button mt-12"
                )}
              >
                {slice.primary.button_link.text}
              </a>
            )}
          </div>
        </div>

        <div className="text-side relative z-80 grid h-screen items-center gap-4 md:grid-cols-2">
          <PrismicNextImage
            sizes="(min-width: 768px) 0px, 100vw"
            preload
            className="w-full md:hidden"
            field={slice.primary.cans_image}
          />

          <div>
            <h2 className="text-side-heading text-6xl font-black text-balance text-sky-950 uppercase lg:text-8xl">
              <TextSplitter text={asText(slice.primary.second_heading)} />
            </h2>

            <div className="text-side-body mt-4 max-w-xl text-xl font-normal text-balance text-sky-950">
              <PrismicRichText field={slice.primary.second_body} />
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
