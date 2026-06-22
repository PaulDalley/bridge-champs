import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// On-demand ISR. The admin article editor calls this on publish/edit so changes
// go live in seconds without a full rebuild:
//   POST /api/revalidate?secret=XXX&path=/learn/bidding/reverses
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const path = searchParams.get("path");
  if (!path || !path.startsWith("/learn/")) {
    return NextResponse.json({ ok: false, error: "missing or invalid path" }, { status: 400 });
  }
  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path });
}
