import { NextRequest, NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const adapter = AdapterFactory.getAdapter();
    const product = await adapter.getProduct(params.id, query);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return handleError(error);
  }
}
