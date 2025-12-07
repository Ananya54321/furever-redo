import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../db/dbConfig";
import Order from "../../../../db/schema/order.schema";
import Product from "../../../../db/schema/product.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectToDatabase();

async function getUser(request) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userToken")?.value;
  const sellerToken = cookieStore.get("sellerToken")?.value;

  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
      return { id: decoded.id, type: "user" };
    } catch {
        return null;  
    }
  }

  if (sellerToken) {
      try {
          const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
          return { id: decoded.id, type: "seller" };
      } catch {
          return null;
      }
  }

  return null;
}

export async function GET(request) {
    const user = await getUser(request);
    
    if (!user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        if (user.type === "user") {
            const orders = await Order.find({ userId: user.id })
                .populate("items.productId")
                .sort({ createdAt: -1 });
            
            return NextResponse.json({ success: true, transactions: orders, type: "purchase" });
        } else {
            const myProducts = await Product.find({ owner: user.id }).select("_id");
            const myProductIds = myProducts.map(p => p._id);

            const orders = await Order.find({ "items.productId": { $in: myProductIds } })
                .populate({
                    path: "items.productId",
                    model: "Product" 
                })
                .populate("userId", "name email") 
                .sort({ createdAt: -1 });
            const sales = orders.map(order => {
                const myItems = order.items.filter(item => 
                     item.productId && myProductIds.some(id => id.toString() === item.productId._id.toString())
                );
                
                const myTotal = myItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);

                return {
                    _id: order._id,
                    createdAt: order.createdAt,
                    buyer: order.userId,
                    items: myItems,
                    totalAmount: myTotal,
                    status: order.paymentStatus,
                    shippingAddress: order.shippingAddress
                };
            }).filter(sale => sale.items.length > 0);

            return NextResponse.json({ success: true, transactions: sales, type: "sale" });
        }
    } catch (error) {
        console.error("Transactions Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
