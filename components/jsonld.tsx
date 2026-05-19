interface Props {
  readonly object: {
    "@context": "https://schema.org";
  };
}

export const JsonLd = ({ object }: Props) => {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(object).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
};
