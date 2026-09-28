import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";

export async function generateMetadata({ params }: PageProps<"/flavor/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("flavor", uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

export default async function Page({ params }: PageProps<"/flavor/[uid]">) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("flavor", uid);

  return <SliceZone slices={page.data.slices} components={components} />;
}
