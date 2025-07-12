const promptEl = document.getElementById('prompt');
const sendBtn  = document.getElementById('send');
const result   = document.getElementById('result');

sendBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return;
  result.innerHTML = '<p>⏳ Routing…</p>';
  try {
    const route = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    }).then(r => r.json());

    const answerRes = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, target: route.target_model })
    }).then(r => r.json());

    // Prettify router decision
    let decisionText = '';
    decisionText += `<strong>Model:</strong> ${route.target_model}<br/>`;
    decisionText += `<strong>Confidence:</strong> ${route.confidence}<br/>`;
    if (route.reasoning) decisionText += `<strong>Reasoning:</strong> ${route.reasoning}<br/>`;
    if (route.notes) decisionText += `<strong>Notes:</strong> ${route.notes}<br/>`;

    // Prettify model response (plain text, preserve line breaks)
    let responseText = '';
    if (typeof answerRes.answer === 'string') {
      responseText = answerRes.answer.replace(/\n/g, '<br/>');
    } else {
      responseText = String(answerRes.answer);
    }

    result.innerHTML = `
      <div class="column">
        <h3>🧭 Router decision</h3>
        <div style="font-size:1.08rem;line-height:1.7;">${decisionText}</div>
      </div>
      <div class="column">
        <h3>🔮 ${route.target_model} response</h3>
        <div style="font-size:1.08rem;line-height:1.7;">${responseText}</div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    result.innerHTML = '<p>❌ Something went wrong.</p>';
  }
});
