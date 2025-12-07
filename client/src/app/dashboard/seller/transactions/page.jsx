"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SellerTransactionsPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await axios.get("/api/transactions");
        if (data.success && data.type === "sale") {
          setSales(data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders & Transactions</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                        </TableRow>
                    ) : sales.length > 0 ? (
                        sales.map((sale) => (
                            <TableRow key={sale._id}>
                                <TableCell className="font-mono text-xs">{sale._id.slice(-6)}...</TableCell>
                                <TableCell>{format(new Date(sale.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{sale.buyer?.name || "Guest"}</span>
                                        <span className="text-xs text-muted-foreground">{sale.buyer?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        {sale.items.map((item, i) => (
                                            <div key={i} className="text-sm">
                                                {item.quantity}x {item.productId?.name}
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={sale.status === "completed" ? "default" : "secondary"}>
                                        {sale.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No sales yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
