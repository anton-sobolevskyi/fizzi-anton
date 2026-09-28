import Link from "next/link";

export default function NotFound() {
  return (
    <div className={"my-28 flex flex-col items-center gap-12"}>
      <div className={"flex grow flex-col items-center justify-center gap-4 text-4xl md:text-6xl"}>
        <b className={"text-6xl md:text-8xl"}>404</b>
        <span className={"font-semibold"}>Page not Found</span>
      </div>
      <Link href="/" className="rounded-xl bg-orange-600 px-5 py-4 text-xl font-bold text-white">
        Go to main page
      </Link>
    </div>
  );
}
