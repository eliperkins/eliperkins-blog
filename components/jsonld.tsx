interface Props {
  readonly object: {
    "@context": "https://schema.org";
  };
}

export const JsonLd = ({ object }: Props) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(object).replace(/</g, "\\u003c"),
      }}
    />
  );
};
