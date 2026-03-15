import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ExtractedStats {
  playerName?: string
  uid?: string
  rank?: string
  kdRatio?: number
  winRate?: number
  totalMatches?: number
  totalKills?: number
  favoriteCharacter?: string
  favoriteWeapon?: string
}

export async function extractStatsFromScreenshot(imageUrl: string): Promise<ExtractedStats> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this Free Fire game screenshot and extract player statistics. 
            Return a JSON object with these fields (use null for any field not visible):
            {
              "playerName": string,
              "uid": string,
              "rank": string (e.g. "Gold III", "Diamond I", "Heroic"),
              "kdRatio": number,
              "winRate": number (percentage as decimal, e.g. 0.15 for 15%),
              "totalMatches": number,
              "totalKills": number,
              "favoriteCharacter": string,
              "favoriteWeapon": string
            }
            Return ONLY the JSON, no explanation.`,
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'high' },
          },
        ],
      },
    ],
    max_tokens: 500,
  })

  const content = response.choices[0]?.message?.content || '{}'
  
  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return {}
  }
}

export default openai
