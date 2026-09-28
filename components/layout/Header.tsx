import { FizziLogo } from "../ui/FizziLogo";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-center py-4">
      <Link href="/">
        <FizziLogo className="z-10 h-20 text-sky-800" />
      </Link>
    </header>
  );
};
