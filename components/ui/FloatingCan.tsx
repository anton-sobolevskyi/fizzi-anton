"use client";
import { forwardRef } from "react";
import type { Group } from "three";
import { Float } from "@react-three/drei";
import { SodaCan, type SodaCanProps } from "./SodaCan";

type FloatingCanProps = {
  flavor?: SodaCanProps["flavor"];
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: React.ReactNode;
};

export const FloatingCan = forwardRef<Group, FloatingCanProps>((props: FloatingCanProps, ref) => {
  const {
    flavor = "blackCherry",
    floatSpeed = 1.5,
    rotationIntensity = 1,
    floatIntensity = 1,
    floatingRange = [-0.1, 0.1],
    children,
    ...rest
  } = props;

  return (
    <group ref={ref} {...rest}>
      <Float
        speed={floatSpeed}
        rotationIntensity={rotationIntensity}
        floatIntensity={floatIntensity}
        floatingRange={floatingRange}
      >
        {children}
        <SodaCan flavor={flavor} />
      </Float>
    </group>
  );
});

FloatingCan.displayName = "FloatingCan";
