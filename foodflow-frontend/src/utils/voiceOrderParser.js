const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

/**
 * Turns a spoken transcript like "add two chicken biryani" into
 * { item: <matching menu item>, quantity: 2 }. Returns item: null if nothing matched.
 */
export function parseVoiceOrder(transcript, items) {
  const text = transcript.toLowerCase().trim()

  let quantity = 1
  const match = text.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/)
  if (match) {
    quantity = NUMBER_WORDS[match[1]] || parseInt(match[1], 10) || 1
  }

  // Match against the spoken text containing the item's name (handles "add the X please")
  const item = items.find((i) => text.includes(i.name.toLowerCase()))

  return { item: item || null, quantity }
}
