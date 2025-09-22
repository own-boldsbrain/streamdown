import { type NextRequest, NextResponse } from "next/server";
import {
  emitComplianceFailed,
  emitTemplateRendered,
  emitTemplateRequested,
} from "../../../../../../lib/analytics/events";
import { compose } from "../../../../../../lib/services/template-composer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  emitTemplateRequested(body);
  try {
    const res = compose(body);
    if (res.compliance.status === "fail") {
      emitComplianceFailed(res.compliance);
    } else {
      emitTemplateRendered({
        placeholdersResolved: res.placeholdersUsed,
        complianceStatus: res.compliance.status,
      });
    }
    return NextResponse.json(res, {
      status: res.compliance.status === "pass" ? 200 : 422,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "compose error" },
      { status: 400 }
    );
  }
}
