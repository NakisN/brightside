exports.handler = async function(event, context) {
  const GEMINI_KEY = 'AIzaSyDkF0MxCQv2igcN2xkA-_eAV2mgT3E-gv4';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const today = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
  const prompt = `Today is ${today}. Generate exactly 10 uplifting, positive, and inspiring news stories from around the world. Mix categories: science breakthroughs, environmental wins, community heroes, medical advances, animal rescues, young innovators, cultural celebrations, humanitarian acts, conservation success, tech for good. Make each story feel genuine and specific with plausible locations and names. Rate each story: feelgood (1-10) and inspirational (1-10). Vary scores realistically. Return ONLY a valid JSON array of 10 objects, no markdown, no backticks, no extra text. Each object: {"emoji":"<one emoji>","category":"<short category>","headline":"<vivid 10-15 word headline>","summary":"<2-3 sentence engaging summary>","feelgood":<number>,"inspirational":<number>}`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 2000 }
      })
    });

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
