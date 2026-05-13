exports.handler = async function(event, context) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const { headline, summary, category } = JSON.parse(event.body || '{}');

  const prompt = `You are a warm, engaging journalist. Expand this news story into a detailed, inspiring article of around 500 words. Keep it uplifting and positive. Use simple HTML paragraph tags <p> only. No headings, no bullet points, no markdown.

Story headline: ${headline}
Category: ${category}
Summary: ${summary}

Write the full article now, HTML paragraphs only:`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2000 }
      })
    });

    const data = await res.json();
    const detail = data.candidates?.[0]?.content?.parts?.[0]?.text || `<p>${summary}</p>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ detail })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ detail: `<p>${summary}</p>` })
    };
  }
};
