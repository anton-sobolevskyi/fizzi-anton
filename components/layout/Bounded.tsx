import { cn } from "@/lib/utils";

type BoundedProps<T extends React.ElementType = "section"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Bounded({ as, className, children, ...restProps }: BoundedProps) {
  const Comp = as ?? "section";

  return (
    <Comp className={cn("px-4 first:pt-10 md:px-6", className)} {...restProps}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">{children}</div>
    </Comp>
  );
}
