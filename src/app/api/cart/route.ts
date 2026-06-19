import { NextRequest, NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const adapter = AdapterFactory.getAdapter();
    const cart = await adapter.createCart(body);
    
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");
    
    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }
    
    const adapter = AdapterFactory.getAdapter();
    const cart = await adapter.getCart(cartId);
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}
