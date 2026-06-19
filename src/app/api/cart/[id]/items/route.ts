import { NextRequest, NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { variantId, quantity } = await request.json();
    const adapter = AdapterFactory.getAdapter();
    const cart = await adapter.addItemToCart(params.id, variantId, quantity);
    
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { itemId, quantity } = await request.json();
    const adapter = AdapterFactory.getAdapter();
    const cart = await adapter.updateItemInCart(params.id, itemId, quantity);
    
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    
    const adapter = AdapterFactory.getAdapter();
    const cart = await adapter.removeItemFromCart(params.id, itemId);
    
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}
