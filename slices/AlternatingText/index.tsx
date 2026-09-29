"use client";

import { FC, Suspense } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

/**
 * Props for `AlternatingText`.
 */
export type AlternatingTextProps = SliceComponentProps<Content.AlternatingTextSlice>;

/**
 * Component for "AlternatingText" Slices.
 */
const AlternatingText: FC<AlternatingTextProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Suspense fallback={null}>
        <Scene groups={slice.primary.text_group} />
      </Suspense>
    </section>
  );
};

export default AlternatingText;
