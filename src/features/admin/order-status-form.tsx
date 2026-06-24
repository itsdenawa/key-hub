"use client";

import { useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { updateOrderStatusAction } from "@/features/admin/actions";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";

type EditableOrder = {
  id: string;
  status: "pending" | "paid" | "fulfilled" | "canceled" | "refunded";
};

type OrderStatusFormProps = {
  order: EditableOrder;
  canSave: boolean;
};

export function OrderStatusForm({ order, canSave }: OrderStatusFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="grid gap-2 sm:grid-cols-[1fr_auto]">
      <input type="hidden" name="id" value={order.id} />
      <Select name="status" defaultValue={order.status}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="fulfilled">Fulfilled</option>
        <option value="canceled">Canceled</option>
        <option value="refunded">Refunded</option>
      </Select>
      <Button type="submit" disabled={!canSave || isPending} variant="outline">
        {isPending ? "Saving..." : "Update"}
      </Button>
      {state.message ? (
        <p
          className={`text-xs ${
            state.status === "success" ? "text-emerald-600" : "text-destructive"
          } sm:col-span-2`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
