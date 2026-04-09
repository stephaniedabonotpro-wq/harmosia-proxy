export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  let body = '';
  for await (const chunk of req) { body += chunk; }
  const { message, bot } = JSON.parse(body);

  const webhooks = {
    free: 'https://hook.eu1.make.com/9yzw2wiupwq9esowbeydim88x7508ptd',
    premium: 'https://hook.eu1.make.com/8ya97qw8mp51855bl6igcnyysdmgm2o3'
  };

  const url = webhooks[bot];
  if (!url) return res.status(400).json({ error: 'Bot inconnu' });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const text = await response.text();
  let reply = text;
  try {
    const json = JSON.parse(text);
    reply = json.response || json.message || json.reply || json.text || text;
  } catch(e) {}

  return res.status(200).json({ reply });
}
