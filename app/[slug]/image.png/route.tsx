/* eslint-disable @next/next/no-img-element */

import { fetchPost, fetchPosts } from "@/lib/posts";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { ImageResponse } from "@vercel/og";
import fs from "fs";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
  data: ArrayBuffer | Buffer;
  name: string;
  weight?: Weight;
  style?: FontStyle;
  lang?: string;
}

export async function generateStaticParams() {
  const postSlugs = await fetchPosts();
  return postSlugs.map(({ slug }) => ({ slug }));
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const post = await fetchPost((await params).slug);
  const durationText = formatDuration(
    intervalToDuration({
      start: 0,
      end: post.readingTime * 60 * 1000,
    }),
  );
  const dateText = format(post.date, "MMMM dd, yyyy");
  const wordCountText = `${new Intl.NumberFormat("en-US", {}).format(post.wordCount)} words`;
  const allText = [
    "Eli Perkins",
    post.title,
    post.unprocessedExcerpt,
    durationText,
    dateText,
    wordCountText,
  ].join("\n");
  return new ImageResponse(
    <div
      style={{ fontFamily: "EB Garamond" }}
      tw="flex flex-col w-full h-full bg-white px-16 py-24 justify-between"
    >
      <div tw="flex flex-col mb-8">
        <h1 tw="text-7xl font-bold text-black my-2 mb-8">{post.title}</h1>
        <h3
          style={{ fontFamily: "Monaspace Neon" }}
          tw="text-4xl font-light tracking-tight text-gray-500 mt-0"
        >
          {post.unprocessedExcerpt}
        </h3>
      </div>
      <div tw="flex items-center">
        <img
          alt="Headshot of Eli Perkins"
          src={await base64DataString("public/images/headshot.jpg")}
          tw="w-20 h-20 rounded-full"
        />
        <div tw="text-4xl grow flex flex-col pl-6 text-gray-700 font-medium">
          <div tw="flex justify-between">
            <p tw="text-gray-500 my-0 mr-4">{dateText}</p>
            <p tw="my-0 text-gray-400">{durationText}</p>
          </div>
          <div tw="flex justify-between">
            <p tw="text-gray-500 my-0 mr-4">Eli Perkins</p>
            <p tw="my-0 text-gray-400">{wordCountText}</p>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 700,
      fonts: [
        ...(await loadMonaspaceFont()),
        await loadGoogleFont("EB Garamond", allText),
      ],
    },
  );
}

async function loadMonaspaceFont(): Promise<FontOptions[]> {
  const normalFontMap = {
    100: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-ExtraLight.ttf",
    200: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-Light.ttf",
    300: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-Regular.ttf",
    400: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-Medium.ttf",
    500: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-SemiBold.ttf",
    600: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-Bold.ttf",
    700: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-ExtraBold.ttf",
  };
  const italicFontMap = {
    100: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-ExtraLightItalic.ttf",
    200: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-LightItalic.ttf",
    300: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-Italic.ttf",
    400: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-MediumItalic.ttf",
    500: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-SemiBoldItalic.ttf",
    600: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-BoldItalic.ttf",
    700: "assets/fonts/monaspace-neon/MonaspaceNeonFrozen-ExtraBoldItalic.ttf",
  };
  return Promise.all([
    ...Object.entries(normalFontMap).map(
      async ([weight, path]) =>
        ({
          name: "Monaspace Neon",
          weight: parseInt(weight, 10) as Weight,
          data: await loadFont(path),
        }) as FontOptions,
    ),
    ...Object.entries(italicFontMap).map(
      async ([weight, path]) =>
        ({
          name: "Monaspace Neon",
          weight: parseInt(weight, 10) as Weight,
          data: await loadFont(path),
          style: "italic",
        }) as FontOptions,
    ),
  ]);
}

async function loadFont(path: string) {
  // load data into array buffer from fs
  const data = await fs.promises.readFile(path);
  return data.buffer;
}

async function loadGoogleFont(
  font: string,
  text: string,
): Promise<FontOptions> {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      const data = await response.arrayBuffer();
      return {
        name: font,
        data,
        style: "normal",
      };
    }
  }

  throw new Error("failed to load font data");
}

async function base64DataString(path: string) {
  const data = await fs.promises.readFile(path);
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}
