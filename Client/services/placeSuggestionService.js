const PLACE_SUGGESTION_API_URL = process.env.EXPO_PUBLIC_PLACE_SUGGESTION_API_URL?.trim();

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
  try {
    response = await fetch(PLACE_SUGGESTION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('network');
  }

  if (!response.ok) throw new Error('request');

  const result = await response.json().catch(() => null);
  return { mode: 'api', result };
}
