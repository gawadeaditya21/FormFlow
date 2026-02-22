const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleJSONResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.message || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return res.json().catch(() => ({}));
}

export async function createFormOnServer(form) {
  const res = await fetch(`${BASE}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  return handleJSONResponse(res);
}

export async function updateFormOnServer(id, form) {
  const res = await fetch(`${BASE}/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  return handleJSONResponse(res);
}

export async function publishFormOnServer(id) {
  const res = await fetch(`${BASE}/forms/${id}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJSONResponse(res);
}

export async function getFormFromServer(idOrToken, byToken = false) {
  const path = byToken ? `forms/share/${idOrToken}` : `forms/${idOrToken}`;
  const res = await fetch(`${BASE}/${path}`);
  return handleJSONResponse(res);
}

export async function submitResponseToServer(formId, response) {
  const res = await fetch(`${BASE}/forms/${formId}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  });
  return handleJSONResponse(res);
}