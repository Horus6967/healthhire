import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ message: "Apply API deprecated." }, { status: 410 });
}
