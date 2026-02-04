// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;

  if (
    uri.startsWith("/posts/") ||
    uri.startsWith("/_next/") ||
    uri.startsWith("/images/") ||
    uri === "/" ||
    uri.includes(".")
  ) {
    return request;
  }

  var accept = headers["accept"];
  if (accept && accept.value.includes("text/markdown")) {
    var slug = uri.replace(/^\//, "").replace(/\/$/, "");

    return {
      statusCode: 302,
      statusDescription: "Found",
      headers: {
        location: { value: `/posts/${slug}.md` },
      },
    };
  }

  return request;
}
