"use client";

import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/layout/Bounded";
import { View } from "@react-three/drei";
import Scene from "./Scene";
import { useMediaQuery } from "@/hooks/useMediaQuary";

/**
 * Props for `AlternatingText`.
 */
export type AlternatingTextProps = SliceComponentProps<Content.AlternatingTextSlice>;

/**
 * Component for "AlternatingText" Slices.
 */
const AlternatingText: FC<AlternatingTextProps> = ({ slice }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="alternating-text-container relative bg-yellow-300 text-sky-950"
    >
      <div>
        <div className="grid">
          {isDesktop && (
            <View className="alternating-text-view absolute top-0 left-0 h-screen w-full">
              <Scene />
            </View>
          )}

          {slice.primary.text_group.map((item, index) => (
            <div
              key={asText(item.heading)}
              className="alternating-section grid h-screen place-items-center gap-x-12 md:grid-cols-2"
            >
              <div className={index % 2 === 0 ? "col-start-1" : "md:col-start-2"}>
                <h2 className="text-6xl font-bold text-balance">{asText(item.heading)}</h2>
                <p className="mt-4 text-xl">{asText(item.body)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Bounded>
  );
};

export default AlternatingText;
