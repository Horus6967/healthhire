export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

interface NpiBasic {
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  status?: string;
}

interface NpiTaxonomy {
  desc?: string;
  state?: string;
  license?: string;
  primary?: boolean;
}

interface NpiResult {
  basic: NpiBasic;
  taxonomies?: NpiTaxonomy[];
}

interface NpiApiResponse {
  result_count: number;
  results: NpiResult[];
}

export async function POST(req: Request) {
  const body = await req.json() as {
    npiNumber: string;
    firstName?: string;
    lastName?: string;
    organizationName?: string;
  };

  const { npiNumber, firstName, lastName, organizationName } = body;

  if (!npiNumber) {
    return NextResponse.json({ verified: false, error: "NPI number required" }, { status: 400 });
  }

  try {
    const url = `https://npiregistry.cms.hhs.gov/api/?number=${encodeURIComponent(npiNumber)}&version=2.1`;
    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
      return NextResponse.json({ verified: false });
    }

    const data = await response.json() as NpiApiResponse;

    if (!data.result_count || data.result_count === 0 || !data.results?.length) {
      return NextResponse.json({ verified: false });
    }

    const result = data.results[0];
    const basic = result.basic;

    // Find primary taxonomy
    const primaryTaxonomy = result.taxonomies?.find((t) => t.primary) ?? result.taxonomies?.[0];

    let nameMatched = false;

    if (basic.organization_name) {
      // Organization NPI
      if (organizationName) {
        nameMatched = basic.organization_name.toLowerCase() === organizationName.toLowerCase();
      } else {
        // No org name provided — accept the NPI as found
        nameMatched = true;
      }
    } else {
      // Individual NPI
      if (firstName && lastName) {
        const apiFirst = (basic.first_name ?? "").toLowerCase();
        const apiLast = (basic.last_name ?? "").toLowerCase();
        nameMatched =
          apiFirst === firstName.toLowerCase() && apiLast === lastName.toLowerCase();
      } else {
        // No name provided — accept the NPI as found
        nameMatched = true;
      }
    }

    if (!nameMatched) {
      return NextResponse.json({ verified: false });
    }

    const displayName = basic.organization_name
      ? basic.organization_name
      : `${basic.first_name ?? ""} ${basic.last_name ?? ""}`.trim();

    return NextResponse.json({
      verified: true,
      name: displayName,
      taxonomy: primaryTaxonomy?.desc ?? null,
      state: primaryTaxonomy?.state ?? null,
    });
  } catch {
    return NextResponse.json({ verified: false });
  }
}
