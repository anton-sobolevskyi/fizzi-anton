"use client";

import { FC, Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/layout/Bounded";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

/**
 * Props for `SkyDive`.
 */
export type SkyDiveProps = SliceComponentProps<Content.SkyDiveSlice>;

/**
 * Component for "SkyDive" Slices.
 */
const SkyDive: FC<SkyDiveProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="skydive -mt-28 h-screen"
    >
      <h2 className="sr-only">{slice.primary.sentence}</h2>
      <div className="h-screen w-screen">
        <Suspense fallback={null}>
          <Scene flavor={slice.primary.flavor ?? "blackCherry"} sentence={slice.primary.sentence} />
        </Suspense>
      </div>
    </Bounded>
  );
};

export default SkyDive;
