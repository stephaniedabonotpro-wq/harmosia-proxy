export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { message, bot, sessionId } = req.body || {};

  const webhooks = {
    free: 'https://hook.eu1.make.com/9yzw2wiupwq9esowbeydim88x7508ptd',
    premium: 'https://hook.eu1.make.com/8ya97qw8mp51855bl6igcnyysdmgm2o3'
  };

  const url = webhooks[bot] || webhooks.free;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });

  const text = await response.text();
  let reply = text;
  try {
    const json = JSON.parse(text);
    reply = json.response || json.message || json.reply || json.text || text;
  } catch(e) {}

  res.status(200).json({ reply });
}
