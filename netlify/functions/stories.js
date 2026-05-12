exports.handler = async function(event, context) {
  const GEMINI_KEY = 'AIzaSyDkF0MxCQv2igcN2xkA-_eAV2mgT3E-gv4';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const today = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
  const prompt = `Today is ${today}. Generate exactly 10 uplifting news stories. Return ONLY a JSON array of 10 objects. Each object: {"emoji":"<emoji>","category":"<category>","headline":"<headline under 12 words>","summary":"<1-2 short sentences>","feelgood":<1-10>,"inspirational":<1-10>}. No markdown, no backticks, nothing else.`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 4000 }
      })
    });

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
    const clean = text.replace(/```json|```/g, '').trim();
    const stories = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(stories)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
