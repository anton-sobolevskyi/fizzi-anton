"use client";

import { FC, Suspense, useState } from "react";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { ArrowIcon } from "./ArrowIcon";
import { cn } from "@/lib/utils";
import { WavyCircles } from "./WavyCircle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FLAVORS } from "@/slices/Carousel/constants";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

gsap.registerPlugin(useGSAP);

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel: FC<CarouselProps> = ({ slice }) => {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [nextFlavorIndex, setNextFlavorIndex] = useState(0);

  function changeFlavor(index: number) {
    const nextIndex = (index + FLAVORS.length) % FLAVORS.length;

    const tl = gsap.timeline();

    setNextFlavorIndex(nextIndex);

    tl.to(
      ".background, .wavy-circles-outer, .wavy-circle-inner",
      {
        backgroundColor: FLAVORS[nextIndex].color,
        fill: FLAVORS[nextIndex].color,
        ease: "power2.inOut",
        duration: 1,
      },
      0
    )
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentFlavorIndex(nextIndex) }, 0.5)
      .to(".text-wrapper", { duration: 0.2, y: 0, opacity: 1 }, 0.7);
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={"flavors"}
      className="carousel relative grid h-screen grid-rows-[auto_4fr_auto] justify-center overflow-hidden bg-white py-12 text-white"
    >
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" />

      <WavyCircles className="absolute top-1/2 left-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]" />
      <h2 className="relative text-center text-5xl font-bold">{asText(slice.primary.heading)}</h2>

      <div className="grid grid-cols-[auto_auto_auto] items-center">
        <ArrowButton
          direction="left"
          label="Previous Flavor"
          onClick={() => changeFlavor(currentFlavorIndex - 1)}
        />
        <div className={"z-1000 aspect-square h-[70vmin] min-h-40"}>
          <Suspense fallback={null}>
            <Scene flavorIndex={nextFlavorIndex} />
          </Suspense>
        </div>

        <ArrowButton
          direction="right"
          label="Next Flavor"
          onClick={() => changeFlavor(currentFlavorIndex + 1)}
        />
      </div>
      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-4xl font-medium">
          <p>{FLAVORS[currentFlavorIndex].name}</p>
        </div>
        <div className="mt-2 text-2xl font-normal opacity-90">
          <PrismicRichText field={slice.primary.price_copy} />
        </div>
      </div>
    </section>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "left" | "right";
  label: string;
  onClick: () => void;
};

function ArrowButton(props: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="z-20 size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={cn(props.direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{props.label}</span>
    </button>
  );
}
