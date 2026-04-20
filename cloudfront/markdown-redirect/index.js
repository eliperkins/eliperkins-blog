// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;
  var accept = headers["accept"];

  // Handle homepage markdown content negotiation
  if (uri === "/" || uri === "") {
    if (accept && accept.value.includes("text/markdown")) {
      return {
        statusCode: 302,
        statusDescription: "Found",
        headers: {
          location: { value: "/index.md" },
        },
      };
    }
    return request;
  }

  if (
    uri.startsWith("/posts/") ||
    uri.startsWith("/_next/") ||
    uri.startsWith("/images/") ||
    uri.includes(".")
  ) {
    return request;
  }

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
