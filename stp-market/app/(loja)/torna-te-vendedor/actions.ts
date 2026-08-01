"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  vendorApplicationSchema,
  type VendorApplicationInput,
} from "@/lib/validations/vendor";

export async function applyAsVendor(input: VendorApplicationInput) {
  const data = vendorApplicationSchema.parse(input);

  const existing = await prisma.vendor.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Já existe uma candidatura com este email.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.vendor.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      message: data.message || null,
    },
  });
}
