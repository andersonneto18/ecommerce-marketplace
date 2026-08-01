"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function approveVendor(vendorId: string) {
  await prisma.vendor.update({ where: { id: vendorId }, data: { status: "APPROVED" } });
  revalidatePath("/admin/fornecedores");
}

export async function rejectVendor(vendorId: string) {
  await prisma.vendor.update({ where: { id: vendorId }, data: { status: "REJECTED" } });
  revalidatePath("/admin/fornecedores");
}

export async function markWithdrawalPaid(requestId: string) {
  await prisma.withdrawalRequest.update({
    where: { id: requestId },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/admin/fornecedores");
}
