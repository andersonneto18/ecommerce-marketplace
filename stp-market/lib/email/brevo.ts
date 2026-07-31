const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function parseSender(): { name: string; email: string } {
  const raw = process.env.EMAIL_FROM ?? "STP Market <onboarding@stpmarket.pt>";
  const match = raw.match(/^(.*)<(.+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "STP Market", email: raw.trim() };
}

type SendEmailInput = {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY não está configurada.");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(),
      to,
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo respondeu ${response.status}: ${errorBody}`);
  }

  return response.json();
}
