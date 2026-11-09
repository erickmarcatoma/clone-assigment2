/**
 * Urgency Scorer - Rule-based urgency calculation
 */

export function calculateUrgency(message) {
  const text = message.toLowerCase().replace(/[’]/g, "'")

  const highUrgency = [
    /\bdown\b/,
    /\boutage\b/,
    /\bsecurity\b/,
    /\bcharged twice\b/,
    /\burgent\b/,
    /\bcan(?:not|'t) log in\b/,
    /\bcan not log in\b/
  ]
  if (highUrgency.some(pattern => pattern.test(text))) return 'High'

  const mediumUrgency = [
    /\bbug\b/,
    /\berror\b/,
    /\bpayments?\b/,
    /\brefund\b/,
    /\bcancel(?:led|ed|ing)?\b/
  ]
  if (mediumUrgency.some(pattern => pattern.test(text))) return 'Medium'

  return 'Low'
}
