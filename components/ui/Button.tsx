import { PrismicNextLink } from "@prismicio/next";
import type { LinkField } from "@prismicio/client";
import { cn } from "@/lib/utils";

type Props = {
  buttonLink: LinkField;
  buttonText: string | null;
  className?: string;
};

export const Button = (props: Props) => {
  return (
    <PrismicNextLink
      field={props.buttonLink}
      className={cn(
        "rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold tracking-wide uppercase transition-colors duration-150 hover:bg-orange-700 md:text-2xl",
        props.className
      )}
    >
      {props.buttonText}
    </PrismicNextLink>
  );
};
