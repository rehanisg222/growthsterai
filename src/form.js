/*
 * GROWTHSTERAI WAITLIST FORM
 *
 * ENVIRONMENT VARIABLE REQUIRED:
 * VITE_SHEET_URL must be set before
 * this form will submit correctly.
 *
 * LOCAL DEVELOPMENT:
 * Create .env.local in project root:
 * VITE_SHEET_URL=https://script.google.com/macros/s/AKfycbzJqsDa5frwad2AcCLGbvvaGJ6soTfkfb3UQTZrtyaPKDmwhE5ZJqe3DzJIKaGzNqJL/exec
 *
 * VERCEL PRODUCTION:
 * Go to: Project Settings → Environment Variables
 * Add key:   VITE_SHEET_URL
 * Add value: [the Apps Script URL above]
 * Apply to:  Production, Preview, Development
 * Then redeploy.
 *
 * GOOGLE SHEET:
 * ID: 1R9a0whBzxOtPz63hd9cDaVlsbnvYqDHia2DhQmRW0dI
 * View at: https://docs.google.com/spreadsheets/d/1R9a0whBzxOtPz63hd9cDaVlsbnvYqDHia2DhQmRW0dI
 */

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzJqsDa5frwad2AcCLGbvvaGJ6soTfkfb3UQTZrtyaPKDmwhE5ZJqe3DzJIKaGzNqJL/exec';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setStatus(message, isError = false) {
  const statusEl = document.getElementById('form-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? 'var(--coral)' : 'var(--t3)';
}

function setButtonLoading(isLoading) {
  const btn = document.getElementById('submit-btn');
  if (!btn) return;

  if (isLoading) {
    btn.disabled      = true;
    btn.style.opacity = '0.75';
    btn.innerHTML = `
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
        style="animation:spin 0.75s linear infinite;vertical-align:middle;margin-right:8px;display:inline-block;"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Submitting...
    `;
  } else {
    btn.disabled      = false;
    btn.style.opacity = '1';
    btn.innerHTML     = 'Request early access →';
  }
}

function showSuccess() {
  const formCard     = document.getElementById('wform');
  const successState = document.getElementById('success-state');

  if (formCard)     formCard.style.display     = 'none';
  if (successState) {
    successState.style.display = 'block';
    successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

export async function submitForm() {
  // Read all field values
  const name    = document.getElementById('f-name')?.value.trim()    ?? '';
  const email   = document.getElementById('f-email')?.value.trim()   ?? '';
  const company = document.getElementById('f-company')?.value.trim() ?? '';
  const title   = document.getElementById('f-title')?.value.trim()   ?? '';
  const size    = document.getElementById('f-size')?.value           ?? '';
  const spend   = document.getElementById('f-spend')?.value          ?? '';
  const source  = document.getElementById('f-source')?.value         ?? '';

  // Validate required fields
  if (!name) {
    setStatus('Please enter your full name.', true);
    document.getElementById('f-name')?.focus();
    return;
  }

  if (!email) {
    setStatus('Please enter your work email.', true);
    document.getElementById('f-email')?.focus();
    return;
  }

  if (!validateEmail(email)) {
    setStatus('Please enter a valid email address.', true);
    document.getElementById('f-email')?.focus();
    return;
  }

  if (!company) {
    setStatus('Please enter your company name.', true);
    document.getElementById('f-company')?.focus();
    return;
  }

  // Check SHEET_URL is configured
  if (!SHEET_URL) {
    setStatus(
      'Form configuration error. Please contact us directly at ceo@growthstermedia.com',
      true
    );
    console.error(
      '[GrowthsterAI] VITE_SHEET_URL is not set.\n' +
      'Add it to .env.local for local development.\n' +
      'Add it to Vercel Environment Variables for production.'
    );
    return;
  }

  // Show loading state
  setButtonLoading(true);
  setStatus('Saving your details...');

  // Build submission payload
  const payload = {
    timestamp : new Date().toISOString(),
    name,
    email,
    company,
    title  : title  || '—',
    size   : size   || '—',
    spend  : spend  || '—',
    source : source || '—',
  };

  try {
    // mode: 'no-cors' is required — Google Apps Script does not send
    // CORS headers. The response will be opaque (unreadable), but the
    // data IS saved if no network error is thrown. This is expected.
    await fetch(SHEET_URL, {
      method  : 'POST',
      mode    : 'no-cors',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(payload),
    });

    // If we reach here, the request was dispatched without a network
    // error — show the success state.
    showSuccess();

  } catch (networkError) {
    // Only thrown on actual network failure (no connection, DNS, etc.)
    console.error('[GrowthsterAI] Waitlist submission network error:', networkError);
    setButtonLoading(false);
    setStatus(
      'Network error. Please check your connection and try again, ' +
      'or email us directly: ceo@growthstermedia.com',
      true
    );
  }
}

// Attach to window so inline onclick="submitForm()" works
window.submitForm = submitForm;
