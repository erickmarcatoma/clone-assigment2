/**
 * Recommendation Templates - Maps categories to recommended actions
 */

const actionTemplates = {
  "Billing Issue": {
    High: "Escalate to billing support immediately to investigate the charge or payment issue.",
    Medium: "Review the account's billing history and respond with the relevant payment details.",
    Low: "Direct the customer to the billing portal for account and invoice information."
  },
  "Technical Problem": {
    High: "Escalate to technical support immediately and investigate the reported service issue.",
    Medium: "Troubleshoot the reported problem and share the relevant support steps.",
    Low: "Share the relevant help article or troubleshooting guidance."
  },
  "General Inquiry": {
    High: "Prioritize a response and route the question to the appropriate support team.",
    Medium: "Respond with the relevant information or FAQ.",
    Low: "Respond with the relevant FAQ or product information."
  },
  "Feature Request": {
    High: "Record the request and route it to the product team for review.",
    Medium: "Add the request to the product feedback backlog for review.",
    Low: "Thank the customer and add the idea to the product feedback backlog."
  },
  "Unknown": {
    High: "Review manually and route to the appropriate support team.",
    Medium: "Review manually to determine the appropriate next step.",
    Low: "Review manually if additional context is needed."
  }
}

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency) {
  return actionTemplates[category]?.[urgency] || "Review manually to determine the appropriate next step."
}

/**
 * Get all available categories
 * 
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

/**
 * Determines if message should be escalated
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {boolean} - Whether to escalate
 */
export function shouldEscalate(category, urgency) {
  return urgency === 'High' && category !== 'Feature Request'
}
