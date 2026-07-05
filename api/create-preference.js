export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: req.body.items,
      back_urls: {
        success: "https://club-masa-web.vercel.app",
        failure: "https://club-masa-web.vercel.app",
        pending: "https://club-masa-web.vercel.app"
      },
      auto_return: "approved"
    })
  });

  const data = await response.json();

  res.status(200).json(data);
}

