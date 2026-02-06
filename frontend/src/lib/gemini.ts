import axios from 'axios'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export const generateAIReport = async (
  complaintText: string,
  severity: string,
  location: { lat: number; lng: number },
  detectionResult: any
) => {
  const prompt = `
    A pothole has been reported with the following details:
    - Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
    - Severity Level: ${severity}
    - Complaint Description: ${complaintText}
    - Detection Confidence: ${detectionResult.confidence || 'N/A'}
    - Affected Area: ${detectionResult.area_pixels || 'N/A'} pixels

    Please generate:
    1. An official summary of the pothole (2-3 sentences)
    2. Risk level (low/medium/high/critical)
    3. Recommended action (repair urgency)
    4. Civic impact (why this matters)

    Format as JSON with keys: summary, riskLevel, recommendedAction, civicImpact
  `

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    )

    const text = response.data.contents?.[0]?.parts?.[0]?.text || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text }
  } catch (error) {
    console.error('Gemini API error:', error)
    return { summary: 'Unable to generate AI report at this time.' }
  }
}

export const generateChatResponse = async (message: string, conversationHistory: any[]) => {
  const systemPrompt = `You are a helpful AI assistant for a pothole detection and civic reporting platform. 
    Help users report potholes, track their reports, understand detection results, and guide them through the process.
    Be concise, friendly, and actionable. Do not use emojis in your responses.`

  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ]

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages,
      }
    )

    return response.data.contents?.[0]?.parts?.[0]?.text || 'Sorry, I could not process that. Please try again.'
  } catch (error) {
    console.error('Chat API error:', error)
    return 'I encountered an error. Please try again.'
  }
}
