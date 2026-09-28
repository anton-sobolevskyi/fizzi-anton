"use client";

import { Center, Environment } from "@react-three/drei";
import { FloatingCan } from "@/components/ui/FloatingCan";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { Group } from "three";
import { useGSAP } from "@gsap/react";
import { FLAVORS, SPINS_ON_CHANGE } from "./constants";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

type SceneProps = {
  flavorIndex: number;
};

export default function Scene(props: SceneProps) {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(props.flavorIndex);
  const sodaCanRef = useRef<Group>(null);

  useGSAP(
    () => {
      if (!sodaCanRef.current || props.flavorIndex === currentFlavorIndex) return;

      const tl = gsap.timeline();

      tl.to(sodaCanRef.current.rotation, {
        y:
          props.flavorIndex > currentFlavorIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1,
      }).to({}, { onStart: () => setCurrentFlavorIndex(props.flavorIndex) }, 0.5);
    },
    { dependencies: [props.flavorIndex] }
  );

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} camera={{ fov: 30 }}>
      <Center position={[0, 0, 0]}>
        <FloatingCan
          ref={sodaCanRef}
          flavor={FLAVORS[currentFlavorIndex].flavor}
          floatIntensity={0.3}
          rotationIntensity={1}
        />
      </Center>

      <Environment
        files="/hdr/lobby.hdr"
        environmentIntensity={0.6}
        environmentRotation={[0, 3, 0]}
      />
      <directionalLight intensity={6} position={[0, 1, 1]} />
    </Canvas>
  );
}
