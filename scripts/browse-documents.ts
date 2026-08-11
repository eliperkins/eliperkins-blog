export {};
// Usage: browse-documents.ts <pubUrl> <ownerDid> <siteValue>
// Lists site.standard.document records from ownerDid's PDS where site === siteValue.
// Outputs tab-separated: fullUrl\ttitle\tpublishedAt

const COLLECTION = "site.standard.document";

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

interface DocumentRecord {
  uri: string;
  value: {
    site?: string;
    title?: string;
    path?: string;
    publishedAt?: string;
  };
}

async function main() {
  const [pubUrl, ownerDid, siteValue] = process.argv.slice(2);
  if (!pubUrl || !ownerDid || !siteValue) {
    console.error("Usage: browse-documents.ts <pubUrl> <ownerDid> <siteValue>");
    process.exit(1);
  }

  const pds = await resolvePds(ownerDid);
  const base = pubUrl.replace(/\/$/, "");

  const matched: DocumentRecord[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", ownerDid);
    url.searchParams.set("collection", COLLECTION);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url);
    if (!res.ok) break;

    const data = (await res.json()) as {
      records: DocumentRecord[];
      cursor?: string;
    };

    for (const record of data.records) {
      if (record.value.site === siteValue) matched.push(record);
    }

    cursor = data.cursor;
  } while (cursor);

  matched.sort((a, b) => {
    const ta = a.value.publishedAt
      ? new Date(a.value.publishedAt).getTime()
      : 0;
    const tb = b.value.publishedAt
      ? new Date(b.value.publishedAt).getTime()
      : 0;
    return ta - tb;
  });

  for (const record of matched) {
    const path = record.value.path ?? "";
    const title = record.value.title ?? "(untitled)";
    const publishedAt = record.value.publishedAt
      ? new Date(record.value.publishedAt).toLocaleDateString()
      : "";
    process.stdout.write(
      `${base}${path}\t${title}\t${publishedAt}\t${record.uri}\n`,
    );
  }
}

process.stdout.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EPIPE") process.exit(0);
});
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

main().catch(console.error);
