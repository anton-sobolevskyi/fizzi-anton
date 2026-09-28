"use client";

import { FloatingCan } from "@/components/ui/FloatingCan";
import { useGSAP } from "@gsap/react";
import { Content } from "@prismicio/client";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Flavor = Content.SkyDiveSliceDefaultPrimary["flavor"];

type SceneProps = {
  sentence: string | null;
  flavor: NonNullable<Flavor>;
};

export const Scene = (props: SceneProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (
      !cloudsRef.current ||
      !cloud1Ref.current ||
      !cloud2Ref.current ||
      !canRef.current ||
      !wordsRef.current
    )
      return;

    const mm = gsap.matchMedia();

    mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (context) => {
      if (
        !cloudsRef.current ||
        !cloud1Ref.current ||
        !cloud2Ref.current ||
        !canRef.current ||
        !wordsRef.current
      )
        return;

      const { isDesktop } = context.conditions ?? {};

      const ANGLE = (isDesktop ? -75 : -90) * (Math.PI / 180);

      console.log(ANGLE);

      const getXPosition = (distance: number) => distance * Math.cos(ANGLE);
      const getYPosition = (distance: number) => distance * Math.sin(ANGLE);

      const getXYPositions = (distance: number) => ({
        x: getXPosition(distance),
        y: getYPosition(distance),
      });

      gsap.set(cloudsRef.current.position, { z: 10 });
      gsap.set(canRef.current.position, { ...getXYPositions(-4) });
      gsap.set(
        wordsRef.current.children.map((word) => word.position),
        { ...getXYPositions(7), z: 2 }
      );
      gsap.set(wordsRef.current.position, {
        z: -12,
      });

      gsap.to(canRef.current.rotation, { y: Math.PI * 2, repeat: -1, duration: 1.7, ease: "none" });

      const DISTANCE = 15;
      const DURATION = 6;

      gsap.set([cloud1Ref.current.position, cloud2Ref.current.position], {
        ...getXYPositions(DISTANCE),
      });

      gsap.to(cloud1Ref.current.position, {
        y: `+=${getYPosition(DISTANCE * -2)}`,
        x: `+=${getXPosition(DISTANCE * -2)}`,
        ease: "none",
        repeat: -1,
        duration: DURATION,
      });

      gsap.to(cloud2Ref.current.position, {
        y: `+=${getYPosition(DISTANCE * -2)}`,
        x: `+=${getXPosition(DISTANCE * -2)}`,
        ease: "none",
        repeat: -1,
        delay: DURATION / 2,
        duration: DURATION,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".skydive",
          pin: true,
          start: "top top",
          end: "+=2000",
          scrub: 1.5,
        },
      });

      scrollTl
        .to("body", {
          backgroundColor: "hsl(185.66, 72.6%, 85.69%)",
          overwrite: "auto",
          duration: 0.1,
        })
        .to(
          cloudsRef.current.position,
          {
            z: 0,
            duration: 0.3,
          },
          0
        )
        .to(canRef.current.position, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        .to(
          wordsRef.current.children.map((word) => word.position),
          {
            keyframes: [
              { x: 0, y: 0, z: -1 },
              {
                ...getXYPositions(-7),
                z: -7,
              },
            ],
            stagger: 0.3,
          },
          0
        )
        .to(canRef.current.position, {
          ...getXYPositions(4),
          duration: 0.5,
          ease: "back.in(1.7)",
        })
        .to(cloudsRef.current.position, {
          z: 7,
          duration: 0.5,
        });
    });
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={props.flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8c0413" decay={0.6} />
        </FloatingCan>
      </group>

      <Clouds ref={cloudsRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      <group ref={wordsRef}>
        {props.sentence && <ThreeText sentence={props.sentence} color="#f97315" />}
      </group>

      <ambientLight intensity={2} color="#9ddefa" />
      <Environment files="hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  );
};

type ThreeTextProps = {
  sentence: string;
  color?: string;
};

function ThreeText(props: ThreeTextProps) {
  const words = props.sentence.toUpperCase().split(" ");
  const material = new THREE.MeshLambertMaterial();

  return words.map((word, index) => (
    <Text
      key={`${index}-${word}`}
      color={props.color ?? "white"}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX="center"
      anchorY="middle"
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?"
    >
      {word}
    </Text>
  ));
}
