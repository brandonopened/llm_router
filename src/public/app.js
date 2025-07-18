const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const result = document.getElementById('result');
const loginForm = document.getElementById('loginForm');
const mainApp = document.getElementById('mainApp');
const passwordEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

async function checkAuth() {
  try {
    const response = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'test' })
    });
    
    if (response.ok) {
      showMainApp();
    } else {
      showLoginForm();
    }
  } catch (err) {
    showLoginForm();
  }
}

function showLoginForm() {
  loginForm.style.display = 'block';
  mainApp.style.display = 'none';
}

function showMainApp() {
  loginForm.style.display = 'none';
  mainApp.style.display = 'block';
}

loginBtn.addEventListener('click', async () => {
  const password = passwordEl.value;
  if (!password) return;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (response.ok) {
      showMainApp();
      passwordEl.value = '';
    } else {
      alert('Invalid password');
    }
  } catch (err) {
    alert('Login failed');
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
    showLoginForm();
  } catch (err) {
    console.error('Logout failed:', err);
  }
});

passwordEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

checkAuth();

// Function to get icon for each model
function getModelIcon(model) {
  const icons = {
    'gpt-4o': '🤖',
    'gpt-4o-mini': '⚡',
    'claude-sonnet-4-20250514': '🧠',
    'gemini-2-0-flash-exp': '🔍',
    'grok-4': '🚀'
  };
  return icons[model] || '🔮';
}

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
    decisionText += `<strong>Model:</strong> ${getModelIcon(route.target_model)} ${route.target_model}<br/>`;
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
        <h3>${getModelIcon(route.target_model)} ${route.target_model} response</h3>
        <div style="font-size:1.08rem;line-height:1.7;">${responseText}</div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    result.innerHTML = '<p>❌ Something went wrong.</p>';
  }
});
