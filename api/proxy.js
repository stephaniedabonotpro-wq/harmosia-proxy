export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const { message, bot } = await req.json();
  
  const webhooks = {
    free: 'https://hook.eu1.make.com/9yzw2wiupwq9esowbeydim88x7508ptd',
    premium: 'https://hook.eu1.make.com/8ya97qw8mp51855bl6igcnyysdmgm2o3'
  };

  const url = webhooks[bot];
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const text = await response.text();
  let reply = text;
  try { const json = JSON.parse(text); reply = json.response || json.message || json.reply || json.text || text; } catch(e) {}

  return new Response(JSON.stringify({ reply }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
