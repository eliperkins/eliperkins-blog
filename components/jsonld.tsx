import Script from "next/script";

interface Props {
  readonly object: {
    "@context": "https://schema.org";
  };
}

export const JsonLd = ({ object }: Props) => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(object).replace(/</g, "\\u003c"),
      }}
      id="json-ld"
      strategy="beforeInteractive"
      type="application/ld+json"
    />
  );
};
