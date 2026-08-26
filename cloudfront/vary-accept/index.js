// Both representations live at their own URL, so CloudFront never caches the
// wrong one. Downstream caches only know that from Vary: Accept.
function withAccept(vary) {
  if (!vary) return "Accept";

  const fields = vary.value.split(",");
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i].trim().toLowerCase();
    if (field === "accept" || field === "*") return vary.value;
  }

  return `${vary.value}, Accept`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handler(event) {
  const response = event.response;
  const contentType = response.headers["content-type"];
  if (!contentType) return response;

  const type = contentType.value.toLowerCase();
  if (type.indexOf("text/html") !== 0 && type.indexOf("text/markdown") !== 0) {
    return response;
  }

  response.headers["vary"] = { value: withAccept(response.headers["vary"]) };
  return response;
}
