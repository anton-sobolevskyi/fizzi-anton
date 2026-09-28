"use client";

import { FloatingCan } from "@/components/ui/FloatingCan";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import gsap from "gsap";
import scrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, scrollTrigger);

type Props = {};

function Scene({}: Props) {
  const canRef = useRef<Group>(null);

  const bgColors = [
    "hsl(346.52, 100%, 82.55%)",
    "hsl(280, 68.42%, 88.82%)",
    "hsl(85.41, 72.65%, 77.06%)",
  ];

  useGSAP(() => {
    if (!canRef.current) return;

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
    <group ref={canRef}>
      <FloatingCan flavor="strawberryLemonade" />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}

export default Scene;
