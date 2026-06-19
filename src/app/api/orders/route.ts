import { NextRequest, NextResponse } from "next/server";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { handleError } from "@/middleware/utils/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const orderId = searchParams.get("orderId");
    
    const adapter = AdapterFactory.getAdapter();
    
    if (orderId) {
      const order = await adapter.getOrder(orderId);
      return NextResponse.json(order);
    }
    
    if (customerId) {
      const orders = await adapter.listOrders(customerId);
      return NextResponse.json(orders);
    }
    
    return NextResponse.json({ error: "Customer ID or Order ID is required" }, { status: 400 });
  } catch (error) {
    return handleError(error);
  }
}
