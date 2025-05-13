"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    status: "delivered",
    total: 56.67,
    items: [
      {
        id: "1",
        name: "Summer Essentials Bundle",
        quantity: 1,
        price: 56.67,
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2023-06-02",
    status: "processing",
    total: 103.47,
    items: [
      {
        id: "2",
        name: "Home Office Setup Bundle",
        quantity: 1,
        price: 103.47,
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2023-06-10",
    status: "shipped",
    total: 45.98,
    items: [
      {
        id: "p5",
        name: "Wireless Mouse",
        quantity: 1,
        price: 19.99,
      },
      {
        id: "p8",
        name: "Water Bottle",
        quantity: 1,
        price: 14.99,
      },
      {
        id: "p3",
        name: "Sunscreen",
        quantity: 1,
        price: 10.99,
      },
    ],
  },
]

export default function OrdersTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View your past orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-muted-foreground">Placed on {order.date}</div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            {item.quantity} x {item.name}
                          </div>
                          <div>{formatCurrency(item.price)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                      <div>Total</div>
                      <div>{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
