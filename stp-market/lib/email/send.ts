import { sendEmail } from "./brevo";
import {
  newOrderAdminEmail,
  orderConfirmationEmail,
  orderStatusUpdateEmail,
  type OrderEmailItem,
} from "./templates";

export async function sendOrderConfirmationEmail(params: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: OrderEmailItem[];
  total: number;
}) {
  const { subject, html } = orderConfirmationEmail(params);
  await sendEmail({
    to: [{ email: params.customerEmail, name: params.customerName }],
    subject,
    html,
  });
}

export async function sendOrderStatusUpdateEmail(params: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  status: string;
}) {
  const { subject, html } = orderStatusUpdateEmail(params);
  await sendEmail({
    to: [{ email: params.customerEmail, name: params.customerName }],
    subject,
    html,
  });
}

export async function sendNewOrderAdminEmail(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  total: number;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const { subject, html } = newOrderAdminEmail(params);
  await sendEmail({ to: [{ email: adminEmail }], subject, html });
}
