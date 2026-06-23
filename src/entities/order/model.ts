export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "canceled"
  | "refunded";

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  itemsCount: number;
  createdAt: string;
};

export const demoOrders: OrderSummary[] = [
  {
    id: "KH-1001",
    status: "fulfilled",
    totalCents: 4900,
    itemsCount: 1,
    createdAt: "2026-06-20T10:15:00.000Z",
  },
  {
    id: "KH-1002",
    status: "paid",
    totalCents: 7900,
    itemsCount: 1,
    createdAt: "2026-06-22T13:25:00.000Z",
  },
];
