const PLACE_SUGGESTION_API_URL = process.env.EXPO_PUBLIC_PLACE_SUGGESTION_API_URL?.trim();
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Keeps the form independent of the transport. Set
 * EXPO_PUBLIC_PLACE_SUGGESTION_API_URL to switch the demo adapter to an API.
 */
export async function submitPlaceSuggestion(suggestion) {
  const payload = {
    city: suggestion.city.trim(),
    name: suggestion.name.trim(),
    category: suggestion.category,
    address: suggestion.address.trim(),
    description: suggestion.description.trim(),
    placeContacts: suggestion.placeContacts.trim(),
    senderContact: suggestion.senderContact.trim(),
  };

  if (!PLACE_SUGGESTION_API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { mode: 'demo', id: Date.now().toString(), suggestion: payload };
  }

  let response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    response = await fetch(PLACE_SUGGESTION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(error.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error('request');

  const result = await response.json().catch(() => null);
  return { mode: 'api', result };
}
