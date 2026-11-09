import Groq from 'groq-sdk';
import { calculateUrgency } from './urgencyScorer'

/**
 * LLM Helper for categorizing customer support messages
 * Using Groq API for AI-powered categorization
 */

const categories = [
  'Billing Issue',
  'Technical Problem',
  'Feature Request',
  'General Inquiry'
]

const urgencies = ['High', 'Medium', 'Low']

const systemPrompt = `Classify the customer support message into exactly one category:
- Billing Issue: payments, charges, refunds, subscriptions, or cancellations.
- Technical Problem: bugs, errors, outages, login/access failures, or security concerns.
- Feature Request: requests for new or improved product capabilities.
- General Inquiry: general questions, thanks, and messages that do not fit another category.

Assign urgency based on the message topic, not its length, punctuation, capitalization, or the time it was sent:
- High: down, outage, can't log in, security, charged twice, or urgent.
- Medium: bug, error, payment, refund, or cancel.
- Low: thanks, feature requests, general questions, or other messages without a listed urgent issue.
When multiple rules apply, use the highest applicable urgency.

Return only a JSON object with these fields: category (one of the four categories above), urgency (High, Medium, or Low), confidence (number from 0 to 1), and reasoning (brief string).`

/**
 * Categorize and prioritize a customer support message using Groq AI.
 *
 * @param {string} message
 * @returns {Promise<{category: string, urgency: string, confidence: number, reasoning: string, aiUnavailable: boolean}>}
 */
export async function categorizeMessage(message) {
  try {
    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Groq returned an empty response')

    const result = JSON.parse(content)
    if (!categories.includes(result.category)) {
      throw new Error('Groq returned an invalid category')
    }
    if (!urgencies.includes(result.urgency)) {
      throw new Error('Groq returned an invalid urgency')
    }
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      throw new Error('Groq returned an invalid confidence score')
    }
    if (typeof result.reasoning !== 'string' || !result.reasoning.trim()) {
      throw new Error('Groq returned invalid reasoning')
    }

    return {
      category: result.category,
      urgency: result.urgency,
      confidence: result.confidence,
      reasoning: result.reasoning.trim(),
      aiUnavailable: false
    };
  } catch (error) {
    console.warn('Groq AI unavailable; manual review is required:', error.message);
    return {
      category: 'Unknown',
      urgency: calculateUrgency(message),
      confidence: 0,
      reasoning: 'AI unavailable – review manually.',
      aiUnavailable: true
    }
  }
}
