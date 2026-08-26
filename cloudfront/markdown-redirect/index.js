const MARKDOWN = "text/markdown";
const HTML = "text/html";

function parseAccept(value) {
  const ranges = [];
  const entries = value.split(",");

  for (let i = 0; i < entries.length; i++) {
    const params = entries[i].split(";");
    const type = params[0].trim().toLowerCase();
    if (!type) continue;

    let q = 1;
    for (let j = 1; j < params.length; j++) {
      const param = params[j].trim().toLowerCase();
      if (param.indexOf("q=") === 0) {
        const parsed = parseFloat(param.substring(2));
        q = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 1);
      }
    }

    ranges.push({ type: type, q: q });
  }

  return ranges;
}

// RFC 9110 12.5.1: the most specific matching range sets the quality, so
// "text/markdown;q=0.1, */*" prefers HTML even though the wildcard comes last.
function negotiate(ranges, mediaType) {
  const subtypeWildcard = mediaType.split("/")[0] + "/*";
  let best = { q: 0, specificity: 0 };

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    let specificity = 0;
    if (range.type === mediaType) {
      specificity = 3;
    } else if (range.type === subtypeWildcard) {
      specificity = 2;
    } else if (range.type === "*/*") {
      specificity = 1;
    }

    if (specificity > best.specificity) {
      best = { q: range.q, specificity: specificity };
    }
  }

  return best;
}

function prefersMarkdown(markdown, html) {
  if (markdown.q === 0) return false;
  if (markdown.q !== html.q) return markdown.q > html.q;
  // Equal quality: an explicit "text/markdown" beats HTML matched by a wildcard.
  return markdown.specificity > html.specificity;
}

function markdownLocation(uri) {
  if (uri === "/" || uri === "") return "/index.md";
  return `/posts/${uri.replace(/^\//, "").replace(/\/$/, "")}.md`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(event) {
  const request = event.request;
  const uri = request.uri;

  if (
    uri.startsWith("/posts/") ||
    uri.startsWith("/_next/") ||
    uri.startsWith("/images/") ||
    uri.includes(".")
  ) {
    return request;
  }

  const accept = request.headers["accept"];
  if (!accept) return request;

  const ranges = parseAccept(accept.value);
  const markdown = negotiate(ranges, MARKDOWN);
  const html = negotiate(ranges, HTML);

  if (markdown.q === 0 && html.q === 0) {
    return {
      statusCode: 406,
      statusDescription: "Not Acceptable",
      headers: {
        vary: { value: "Accept" },
      },
    };
  }

  if (!prefersMarkdown(markdown, html)) return request;

  return {
    statusCode: 302,
    statusDescription: "Found",
    headers: {
      location: { value: markdownLocation(uri) },
      vary: { value: "Accept" },
    },
  };
}
