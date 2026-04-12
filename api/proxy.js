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

  const { message, bot, sessionId, action, email } = req.body || {};

  // Vérification email acheteur New Era
  if (action === 'check_email') {
    if (!email) {
      res.status(400).json({ authorized: false });
      return;
    }
    try {
      const verifyRes = await fetch('https://hook.eu1.make.com/2lzs4loi6u2dq1fbkblmxq4kvg9n3131', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      const verifyText = await verifyRes.text();
      let authorized = false;
      try {
        const verifyJson = JSON.parse(verifyText);
        authorized = verifyJson.authorized === true || verifyJson.authorized === 'true';
      } catch(e) {
        authorized = verifyText.includes('true');
      }
      res.status(200).json({ authorized });
    } catch(e) {
      res.status(500).json({ authorized: false });
    }
    return;
  }

  // Chatbot
  const webhooks = {
    free: 'https://hook.eu1.make.com/9yzw2wiupwq9esowbeydim88x7508ptd',
    newera: 'https://hook.eu1.make.com/8ya97qw8mp51855bl6igcnyysdmgm2o3'
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
