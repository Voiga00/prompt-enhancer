export const generateQuestions = async (apiKey, promptData) => {
  const { prompt, style, mood, length, temperature, medium, composition } = promptData;


  const questionCounts = {
    short: 3,
    medium: 8,
    long: 15,
  };

  const count = questionCounts[length] || 6;

  const systemPrompt = `
Jesteś asystentem pomagającym użytkownikowi w tworzeniu bardziej szczegółowego prompta do generowania obrazów.
Dane wejściowe:
-Prompt: "${prompt}"
- Styl: "${style}"
- Medium: "${medium}"
- Kompozycja: "${composition}"
- Nastrój: "${mood}"
- Preferowana długość prompta: "${length}" (zadaj ${count} pytań)

Na tej podstawie wygeneruj ${count} krótkich, prostych i konkretynych pytań. Bez komentarza - same pytania. Te pytania niech nie daja zapytań o rzeczach które są już odpowiednio opisane w prompcie użytkownika. 
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Proszę wygeneruj ${count} pytań.` },
      ],
      temperature,
    }),
  });

  if (!response.ok) {
  const errorText = await response.text();
  console.error("generateQuestions — odpowiedź API:", errorText);
  throw new Error(`OpenAI API błąd: ${response.status} ${response.statusText}`);
}

  const data = await response.json();
  const content = data.choices[0].message.content;

  const questions = content
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim());

  return questions.slice(0, count);
};

export const optimizePrompt = async (apiKey, promptData) => {
  const {
    prompt, style, mood, length, temperature, answers, showPreview
  } = promptData;

  const langNote = showPreview
    ? "Wygeneruj prompt po angielsku"
    : "Wygeneruj prompt po polsku.";

  const messages = [
    {
      role: "system",
      content: `Jesteś ekspertem od prompt engineeringu do generowania obrazów.

      Wypisz prompta w krótkich prostych hasłach
      
      Oto dane użytkownika:
- Prompt: "${prompt}"
- Styl: ${style}
- Nastrój: ${mood}
- Długość prompta: ${length}`,
    },
    {
      role: "user",
      content: `


Odpowiedzi użytkownika:
${answers.map((ans, i) => `Pytanie ${i + 1}: ${ans}`).join("\n")}

${langNote}
Nie dodawaj żadnych komentarzy – tylko gotowy prompt.
`,
    },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    throw new Error("Błąd podczas optymalizacji prompta");
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
};

export const generatePreviewPrompt = async (apiKey, { prompt, style, mood, length, temperature }) => {
  const systemPrompt = `
Jesteś ekspertem od prompt engineeringu do generowania obrazów.
Struktura promptu musi być dokładnie taka: 
- medium (np. digital art, oil painting),
- główny temat obrazu (np. white cat lying on table),
- szczegóły kompozycji i atmosfery,
- rezolucja i styl (np. high detail, 4K, photorealistic).



Odpowiadasz ZAWSZE w krótkich, rzeczowych hasłach oddzielonych przecinkami, bez pełnych zdań. 
Nie dodawaj żadnych komentarzy ani wstępów.

Próbuj dodawać hasła adekwatne do obrazu jeśli użytkownik nie podał pełnego opisu obrazu

Zwróć tylko prompt w formie: krótko, prosto, po przecinku, bez numeracji ani komentarzy. 

output użytkownika:
- Prompt użytkownika: "${prompt}"
- Styl: ${style}
- Nastrój: ${mood}
- Długość prompta: ${length}


Niech dlugosc prompta odpowiada ilosciowi atrybutow
krotki - pomiedzy 8 a 13
sredni - 13-20
dlugi 20+

`;

 const userPrompt = `Proszę wygeneruj finalny prompt do obrazu zgodnie z powyższymi danymi.`;


  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
    }),
  });

  if (!res.ok) {
  const errorDetails = await res.text();
  throw new Error(`Błąd API OpenAI: ${res.status} ${res.statusText} - ${errorDetails}`);
}


  const data = await res.json();
  return data.choices[0].message.content.trim();
};
