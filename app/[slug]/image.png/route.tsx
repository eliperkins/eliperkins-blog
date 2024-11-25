/* eslint-disable @next/next/no-img-element */

import { fetchPost, fetchPosts } from "@/lib/posts";
import { ImageResponse } from "@vercel/og";
import fs from "fs";
import { format, formatDuration, intervalToDuration } from "date-fns";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
  data: ArrayBuffer | Buffer<ArrayBufferLike>;
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
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-white px-10 py-12 justify-between">
        <div tw="flex flex-col mb-8">
          <h1 tw="font-sans text-7xl font-bold text-black my-2 mb-8">
            {post.title}
          </h1>
          <h3 tw="font-serif text-5xl font-semibold italic text-gray-500 mt-0">
            {post.unprocessedExcerpt}
          </h3>
        </div>
        <div tw="flex items-center">
          <img
            src={await base64DataString("components/headshot.jpg")}
            alt="Headshot of Eli Perkins"
            tw="w-20 h-20 rounded-full"
          />
          <div tw="text-4xl grow flex flex-col pl-6 text-gray-700 font-medium">
            <div tw="flex justify-between">
              <p tw="text-gray-500 my-0 mr-4">
                {format(post.date, "MMMM dd, yyyy")}
              </p>
              <p tw="my-0 text-gray-400">
                {formatDuration(
                  intervalToDuration({
                    start: 0,
                    end: post.readingTime * 60 * 1000,
                  }),
                )}
              </p>
            </div>
            <div tw="flex justify-between">
              <p tw="text-gray-500 my-0 mr-4">Eli Perkins</p>
              <p tw="my-0 text-gray-400">
                {new Intl.NumberFormat("en-US", {}).format(post.wordCount)}{" "}
                words
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 700,
      fonts: [
        ...(await loadRalewayFonts()),
        ...(await loadQuattrocentoFonts()),
      ],
    },
  );
}

async function loadRalewayFonts(): Promise<FontOptions[]> {
  const normalFontMap: { [key in Weight]: string } = {
    100: "assets/fonts/Raleway/static/Raleway-Thin.ttf",
    200: "assets/fonts/Raleway/static/Raleway-ExtraLight.ttf",
    300: "assets/fonts/Raleway/static/Raleway-Light.ttf",
    400: "assets/fonts/Raleway/static/Raleway-Regular.ttf",
    500: "assets/fonts/Raleway/static/Raleway-Medium.ttf",
    600: "assets/fonts/Raleway/static/Raleway-SemiBold.ttf",
    700: "assets/fonts/Raleway/static/Raleway-Bold.ttf",
    800: "assets/fonts/Raleway/static/Raleway-ExtraBold.ttf",
    900: "assets/fonts/Raleway/static/Raleway-Black.ttf",
  };
  const italicFontMap: { [key in Weight]: string } = {
    100: "assets/fonts/Raleway/static/Raleway-ThinItalic.ttf",
    200: "assets/fonts/Raleway/static/Raleway-ExtraLightItalic.ttf",
    300: "assets/fonts/Raleway/static/Raleway-LightItalic.ttf",
    400: "assets/fonts/Raleway/static/Raleway-Italic.ttf",
    500: "assets/fonts/Raleway/static/Raleway-MediumItalic.ttf",
    600: "assets/fonts/Raleway/static/Raleway-SemiBoldItalic.ttf",
    700: "assets/fonts/Raleway/static/Raleway-BoldItalic.ttf",
    800: "assets/fonts/Raleway/static/Raleway-ExtraBoldItalic.ttf",
    900: "assets/fonts/Raleway/static/Raleway-BlackItalic.ttf",
  };
  return Promise.all([
    ...Object.entries(normalFontMap).map(
      async ([weight, path]) =>
        ({
          name: "Raleway",
          weight: parseInt(weight, 10) as Weight,
          data: await loadFont(path),
        }) as FontOptions,
    ),
    ...Object.entries(italicFontMap).map(
      async ([weight, path]) =>
        ({
          name: "Raleway",
          weight: parseInt(weight, 10) as Weight,
          data: await loadFont(path),
          style: "italic",
        }) as FontOptions,
    ),
  ]);
}

async function loadQuattrocentoFonts(): Promise<FontOptions[]> {
  return [
    {
      name: "Quattrocento",
      data: await loadFont(
        "assets/fonts/Quattrocento/Quattrocento-Regular.ttf",
      ),
    } as FontOptions,
    {
      name: "Quattrocento",
      data: await loadFont("assets/fonts/Quattrocento/Quattrocento-Bold.ttf"),
      weight: 700,
    } as FontOptions,
  ];
}

async function loadFont(path: string) {
  // load data into array buffer from fs
  const data = await fs.promises.readFile(path);
  return data.buffer;
}

async function base64DataString(path: string) {
  const data = await fs.promises.readFile(path);
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}
