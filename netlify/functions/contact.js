/* ===== NETLIFY FUNCTION: отправка заявки в Telegram ===== */

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, phone } = JSON.parse(event.body);

    if (!name || !phone) {
      return { statusCode: 400, body: JSON.stringify({ ok: false }) };
    }

    const token  = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🆕 Новая заявка с сайта\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}`,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false }),
    };
  }
};
