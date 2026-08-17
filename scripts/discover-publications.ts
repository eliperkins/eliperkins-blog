export {};

const JETSTREAM = "wss://jetstream2.us-east.bsky.network/subscribe";
const COLLECTION = "site.standard.document";
const CONCURRENCY = 8;

async function resolvePds(did: string): Promise<string> {
  if (did.startsWith("did:web:")) {
    return `https://${did.slice(8)}`;
  }
  try {
    const res = await fetch(`https://plc.directory/${did}`);
    if (!res.ok) return "https://bsky.social";
    const doc = (await res.json()) as {
      service?: { id: string; serviceEndpoint: string }[];
    };
    const svc = doc.service?.find((s) => s.id === "#atproto_pds");
    return svc?.serviceEndpoint ?? "https://bsky.social";
  } catch {
    return "https://bsky.social";
  }
}

async function getRecord(
  atUri: string,
): Promise<Record<string, unknown> | null> {
  const match = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(atUri);
  if (!match) return null;
  const [, repo, collection, rkey] = match;
  const pds = await resolvePds(repo);
  const url = new URL(`${pds}/xrpc/com.atproto.repo.getRecord`);
  url.searchParams.set("repo", repo);
  url.searchParams.set("collection", collection);
  url.searchParams.set("rkey", rkey);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as { value: Record<string, unknown> };
  return data.value;
}

async function resolvePublication(
  committerDid: string,
  site: string,
): Promise<{ url: string; ownerDid: string } | null> {
  if (!site.startsWith("at://")) {
    return { url: site, ownerDid: committerDid };
  }
  const ownerDid = /^at:\/\/([^/]+)\//.exec(site)?.[1] ?? committerDid;
  const pub = await getRecord(site);
  const url = pub?.url;
  if (typeof url !== "string") return null;
  return { url, ownerDid };
}

interface JetstreamEvent {
  did?: string;
  kind?: string;
  commit?: {
    operation?: string;
    collection?: string;
    record?: Record<string, unknown>;
  };
}

function main() {
  const seenSites = new Set<string>();
  const seenUrls = new Set<string>();
  let active = 0;
  const queue: { did: string; site: string }[] = [];

  const wsUrl = new URL(JETSTREAM);
  wsUrl.searchParams.set("wantedCollections", COLLECTION);
  const ws = new WebSocket(wsUrl.toString());

  function exit(code = 0) {
    ws.close();
    process.exit(code);
  }

  function drainQueue() {
    while (queue.length > 0 && active < CONCURRENCY) {
      const item = queue.shift();
      if (!item) break;
      active++;
      resolvePublication(item.did, item.site)
        .then((result) => {
          if (result && !seenUrls.has(result.url)) {
            seenUrls.add(result.url);
            process.stdout.write(
              `${result.url}\t${result.ownerDid}\t${item.site}\n`,
            );
          }
        })
        .catch(() => undefined)
        .finally(() => {
          active--;
          drainQueue();
        });
    }
  }

  ws.addEventListener("close", () => process.exit(0));
  ws.addEventListener("error", (e) => {
    console.error(e);
    exit(1);
  });

  ws.addEventListener("message", (event) => {
    let msg: JetstreamEvent;
    try {
      msg = JSON.parse(event.data as string) as JetstreamEvent;
    } catch {
      return;
    }

    if (msg.kind !== "commit") return;
    if (msg.commit?.operation === "delete") return;

    const site = msg.commit?.record?.site;
    if (typeof site !== "string" || !site) return;
    if (seenSites.has(site)) return;
    seenSites.add(site);

    if (!msg.did) return;
    queue.push({ did: msg.did, site });
    drainQueue();
  });

  process.stdout.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EPIPE") exit(0);
  });

  process.on("SIGINT", () => {
    exit(0);
  });
  process.on("SIGTERM", () => {
    exit(0);
  });
}

main();
