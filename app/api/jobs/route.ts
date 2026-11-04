import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "Jobs API deprecated. See /employers/candidates" });
}
