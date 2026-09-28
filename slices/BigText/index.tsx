import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BigText`.
 */
export type BigTextProps = SliceComponentProps<Content.BigTextSlice>;

/**
 * Component for "BigText" Slices.
 */
const BigText: FC<BigTextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full overflow-hidden bg-[#fe6334]"
    >
      <h2 className="grid w-full gap-[3vw] py-10 text-center leading-[0.7] font-black text-[#fee832] uppercase">
        <div className="text-[34vw]">Soda</div>
        <div className="flex justify-between px-[1vw] text-[11vw]">
          <span className="">that</span>
          <span className="">makes</span>
          <span className="">you</span>
        </div>
        <div className="text-[32vw]">Smile</div>
      </h2>
    </section>
  );
};

export default BigText;
