"use client";

import { useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { updateOrderStatusAction } from "@/features/admin/actions";
import { cn } from "@/shared/lib/utils";
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
    <form action={formAction} className="grid min-w-[260px] gap-2">
      <input type="hidden" name="id" value={order.id} />
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Select
          className="h-9 border-white/10 bg-[#0a1223] text-white focus-visible:ring-violet-400/40"
          name="status"
          defaultValue={order.status}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="canceled">Canceled</option>
          <option value="refunded">Refunded</option>
        </Select>
        <Button
          className="border-white/10 bg-white/[0.035] text-slate-200 hover:bg-violet-500/10 hover:text-white"
          type="submit"
          disabled={!canSave || isPending}
          variant="outline"
        >
          {isPending ? "Saving..." : "Update"}
        </Button>
      </div>
      {state.message ? (
        <p
          className={cn(
            "text-xs",
            state.status === "success"
              ? "text-emerald-600"
              : "text-destructive",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
