// -----------------------------------------------------------------------
// Notification layer: sends the email OTP, phone OTP, and the follow-up
// "click to verify" email link.
//
// Out of the box, with no provider credentials configured, everything is
// simply logged to the server console so you can develop/test the full
// signup flow locally (the codes show up in your terminal). To go live:
//
//   EMAIL: set RESEND_API_KEY (https://resend.com) and EMAIL_FROM in .env
//          — or swap sendEmail() below for your own SMTP/Nodemailer call.
//   SMS:   set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
//          in .env — or swap sendSms() below for your own provider.
// -----------------------------------------------------------------------

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Hungry Chicken <orders@hungrychicken.example>";

  if (!apiKey) {
    console.log(`\n📧  [DEV EMAIL] to=${to} subject="${subject}"\n${html.replace(/<[^>]+>/g, " ")}\n`);
    return { ok: true, dev: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("Resend email failed", await res.text());
    return { ok: false };
  }
  return { ok: true };
}

async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from || !to) {
    console.log(`\n📱  [DEV SMS] to=${to || "(no phone on file)"} body="${body}"\n`);
    return { ok: true, dev: true };
  }

  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    console.error("Twilio SMS failed", await res.text());
    return { ok: false };
  }
  return { ok: true };
}

export async function sendEmailOtp(email: string, code: string) {
  return sendEmail(
    email,
    "Your Hungry Chicken verification code",
    `<p style="font-family:sans-serif">Your email verification code is:</p>
     <p style="font-family:sans-serif;font-size:32px;font-weight:900;letter-spacing:4px">${code}</p>
     <p style="font-family:sans-serif;color:#666">This code expires in 10 minutes.</p>`
  );
}

export async function sendPhoneOtp(phone: string, code: string) {
  return sendSms(phone, `Hungry Chicken verification code: ${code} (valid 10 minutes)`);
}

export async function sendVerificationLinkEmail(email: string, verifyUrl: string) {
  return sendEmail(
    email,
    "Confirm your Hungry Chicken account",
    `<p style="font-family:sans-serif">Nice — your email and phone are both verified. One last step:</p>
     <p><a href="${verifyUrl}" style="font-family:sans-serif;font-weight:900;background:#111;color:#fff;padding:12px 20px;text-decoration:none;display:inline-block">CONFIRM MY ACCOUNT</a></p>
     <p style="font-family:sans-serif;color:#666">Or paste this link into your browser:<br/>${verifyUrl}</p>`
  );
}

export async function notifyAdminNewOrder(order: { id: string; totalAmount: number }) {
  // Per the locked-in spec: the owner MUST be emailed on every incoming
  // order (this is not optional — it's the only order-visibility channel
  // since there's no live dashboard). Set ADMIN_NOTIFY_EMAIL in .env.
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.warn(
      `⚠️  ADMIN_NOTIFY_EMAIL is not set — order #${order.id.slice(-6)} was NOT emailed to the owner. Set ADMIN_NOTIFY_EMAIL in .env.`
    );
    return;
  }
  await sendEmail(
    adminEmail,
    `New order #${order.id.slice(-6)} — €${order.totalAmount.toFixed(2)}`,
    `<p style="font-family:sans-serif">A new order just came in. Open the Kitchen Portal to view it.</p>`
  );
}
