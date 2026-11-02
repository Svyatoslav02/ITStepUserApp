export async function submitFeedback({ replyContact, message }) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (replyContact.trim().toLowerCase() === 'error@example.com') {
    throw new Error('Не вдалося надіслати повідомлення.');
  }

  return {
    id: Date.now().toString(),
    replyContact: replyContact.trim(),
    message: message.trim(),
  };
}
