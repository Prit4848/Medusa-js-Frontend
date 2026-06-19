import { NextRequest, NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    const adapter = AdapterFactory.getAdapter();
    const result = await adapter.listProducts(query);
    
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
