import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordDisplayStyle?: "inline-block" | "block";
};

export function TextSplitter({ text, className, wordDisplayStyle = "inline-block" }: Props) {
  if (!text) return null;

  const words = text.split(" ");

  return words.map((word: string, wordIndex: number) => {
    const splitText = word.split("");
    return (
      <span
        className={cn("split-word", className)}
        style={{ display: wordDisplayStyle, whiteSpace: "pre" }}
        key={`${wordIndex.toString()}-${word}`}
      >
        {splitText.map((char, charIndex) => {
          if (char === " ") return ` `;
          return (
            <span
              key={charIndex}
              className={`split-char inline-block split-char--${wordIndex.toString()}-${charIndex.toString()}`}
            >
              {char}
            </span>
          );
        })}
        {wordIndex < words.length - 1 ? <span className="split-char">{` `}</span> : ""}
      </span>
    );
  });
}
