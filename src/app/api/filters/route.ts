import { NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function GET() {
  try {
    const adapter = AdapterFactory.getAdapter();
    const filters = await adapter.getFilters();
    
    return NextResponse.json(filters);
  } catch (error) {
    return handleError(error);
  }
}
