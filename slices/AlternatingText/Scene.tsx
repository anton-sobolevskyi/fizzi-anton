"use client";

import { FloatingCan } from "@/components/ui/FloatingCan";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import gsap from "gsap";
import scrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { asText, Content } from "@prismicio/client";
import { cn } from "@/lib/utils";
import { Group } from "three";
import { Bounded } from "@/components/layout/Bounded";

gsap.registerPlugin(useGSAP, scrollTrigger);

type Props = {
  groups: Content.AlternatingTextSliceDefaultPrimaryTextGroupItem[];
};

const Scene = (props: Props) => {
  const canRef = useRef<Group>(null);

  const bgColors = [
    "hsl(346.52, 100%, 82.55%)",
    "hsl(280, 68.42%, 88.82%)",
    "hsl(85.41, 72.65%, 77.06%)",
  ];

  useGSAP(() => {
    console.log(canRef.current);
    if (!canRef.current) return;

    console.log(canRef.current);

    const mm = gsap.matchMedia();
    const sections = gsap.utils.toArray(".alternating-section");

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions ?? {};

        if (isDesktop && canRef.current) {
          gsap.set(canRef.current.position, {
            x: 1,
          });

          gsap.set(canRef.current.rotation, {
            y: -0.3,
          });
        }

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".alternating-text-view",
            endTrigger: ".alternating-text-container",
            pin: true,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });

        sections.forEach((_, index) => {
          if (!canRef.current) return;
          if (index === 0) return;

          const isOdd = index % 2 !== 0;

          const xPosition = isDesktop ? (isOdd ? -1 : 1) : 0;
          const yRotation = isDesktop ? (isOdd ? 0.4 : -0.4) : 0;

          scrollTl
            .to(canRef.current.position, {
              x: xPosition,
              ease: "circ.inOut",
              delay: 0.5,
            })
            .to(
              canRef.current.rotation,
              {
                y: yRotation,
                ease: "back.inOut",
              },
              "<"
            )
            .to(".alternating-text-container", {
              backgroundColor: gsap.utils.wrap(bgColors, index),
            });
        });
      }
    );
  });

  return (
    <Bounded className={"alternating-text-container relative bg-yellow-300 text-sky-950"}>
      <div className="alternating-text-view absolute h-screen w-full">
        <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} camera={{ fov: 30 }}>
          <group ref={canRef}>
            <FloatingCan flavor="strawberryLemonade" />
            <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
          </group>
        </Canvas>
      </div>

      {props.groups.map((item, index) => (
        <div
          key={asText(item.heading)}
          className="alternating-section relative z-100 grid h-screen place-items-center gap-x-12 md:grid-cols-2"
        >
          <div className={cn("relative", index % 2 === 0 ? "col-start-1" : "md:col-start-2")}>
            <h2 className="text-6xl font-bold text-balance">{asText(item.heading)}</h2>
            <p className="mt-4 text-xl">{asText(item.body)}</p>

            <div
              className={
                "absolute top-0 left-0 -z-1 box-content h-full w-full -translate-8 rounded-2xl bg-white/90 p-8 blur-lg md:hidden"
              }
            ></div>
          </div>
        </div>
      ))}
    </Bounded>
  );
};

export default Scene;
