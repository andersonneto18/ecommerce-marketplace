export type OrderEmailItem = {
  name: string;
  quantity: number;
  price: number;
};

function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:0;background-color:#faf5ee;font-family:Georgia,'Times New Roman',serif;color:#2b1d13;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf5ee;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ddce;">
            <tr>
              <td style="background-color:#b5622a;padding:24px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:bold;">Neto STP</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background-color:#faf5ee;border-top:1px solid #e8ddce;">
                <p style="margin:0;font-size:12px;color:#8a7a68;">Neto STP — Produtos de São Tomé e Príncipe para Portugal.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function itemsTable(items: OrderEmailItem[]) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0e8db;">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e8db;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e8db;text-align:right;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px;margin:16px 0;">
      <thead>
        <tr>
          <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #b5622a;">Produto</th>
          <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #b5622a;">Qtd</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #b5622a;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function orderReference(orderId: string) {
  return orderId.slice(-8).toUpperCase();
}

export function orderConfirmationEmail(params: {
  customerName: string;
  orderId: string;
  items: OrderEmailItem[];
  total: number;
}) {
  const body = `
    <p>Olá ${params.customerName},</p>
    <p>Obrigado pela tua compra! Recebemos o teu pagamento e a tua encomenda <strong>#${orderReference(params.orderId)}</strong> já está a ser preparada.</p>
    ${itemsTable(params.items)}
    <p style="text-align:right;font-size:16px;font-weight:bold;">Total: €${params.total.toFixed(2)}</p>
    <p>Vamos avisar-te assim que a tua encomenda for enviada.</p>
  `;
  return {
    subject: "A tua encomenda Neto STP foi confirmada",
    html: emailLayout("Encomenda confirmada", body),
  };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  PROCESSING: "Em preparação",
  SHIPPED: "Enviada",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
};

export function orderStatusUpdateEmail(params: {
  customerName: string;
  orderId: string;
  status: string;
}) {
  const label = STATUS_LABELS[params.status] ?? params.status;

  const body = `
    <p>Olá ${params.customerName},</p>
    <p>O estado da tua encomenda <strong>#${orderReference(params.orderId)}</strong> foi atualizado para:</p>
    <p style="font-size:18px;font-weight:bold;color:#b5622a;">${label}</p>
  `;
  return {
    subject: `A tua encomenda Neto STP está: ${label}`,
    html: emailLayout("Atualização da encomenda", body),
  };
}

export function newOrderAdminEmail(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: OrderEmailItem[];
  total: number;
}) {
  const body = `
    <p>Nova encomenda paga — <strong>#${orderReference(params.orderId)}</strong>.</p>
    ${itemsTable(params.items)}
    <p style="text-align:right;font-size:16px;font-weight:bold;">Total: €${params.total.toFixed(2)}</p>

    <h2 style="margin:24px 0 8px;font-size:15px;">Dados para envio</h2>
    <table role="presentation" width="100%" style="font-size:14px;line-height:1.6;">
      <tr><td style="color:#8a7a68;width:80px;">Nome</td><td>${params.customerName}</td></tr>
      <tr><td style="color:#8a7a68;">Email</td><td>${params.customerEmail}</td></tr>
      <tr><td style="color:#8a7a68;">Telefone</td><td>${params.customerPhone || "—"}</td></tr>
      <tr><td style="color:#8a7a68;">Morada</td><td>${params.address || "—"}</td></tr>
      <tr><td style="color:#8a7a68;">Cidade</td><td>${params.city || "—"}</td></tr>
      <tr><td style="color:#8a7a68;">Cód. postal</td><td>${params.postalCode || "—"}</td></tr>
      <tr><td style="color:#8a7a68;">País</td><td>${params.country || "—"}</td></tr>
    </table>
  `;
  return {
    subject: `Nova encomenda recebida — €${params.total.toFixed(2)}`,
    html: emailLayout("Nova encomenda", body),
  };
}
