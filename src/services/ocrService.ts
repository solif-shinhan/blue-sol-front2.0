const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY || ''

const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`

interface VisionApiResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string
      locale?: string
    }>
    fullTextAnnotation?: {
      text: string
    }
  }>
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function extractTotalAmount(text: string): number {
  const patterns = [
    /합\s*계[:\s]*([0-9,]+)/,
    /총\s*액[:\s]*([0-9,]+)/,
    /결제\s*금액[:\s]*([0-9,]+)/,
    /카드\s*결제[:\s]*([0-9,]+)/,
    /신\s*용\s*카\s*드[:\s]*([0-9,]+)/,
    /합\s*계\s*금\s*액[:\s]*([0-9,]+)/,
    /Total[:\s]*([0-9,]+)/i,
    /TOTAL[:\s]*([0-9,]+)/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseInt(match[1].replace(/,/g, ''), 10)
      if (!isNaN(amount) && amount > 0) {
        return amount
      }
    }
  }

  const numbers = text.match(/[0-9,]{3,}/g)
  if (numbers) {
    const amounts = numbers
      .map((n) => parseInt(n.replace(/,/g, ''), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => b - a)
    if (amounts.length > 0) {
      return amounts[0]
    }
  }

  return 0
}

export async function recognizeReceipt(file: File): Promise<{ amount: number; fullText: string }> {
  const base64Image = await fileToBase64(file)

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 1,
          },
        ],
        imageContext: {
          languageHints: ['ko', 'en'],
        },
      },
    ],
  }

  const response = await fetch(VISION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.status}`)
  }

  const data: VisionApiResponse = await response.json()

  const fullText =
    data.responses[0]?.fullTextAnnotation?.text ||
    data.responses[0]?.textAnnotations?.[0]?.description ||
    ''

  const amount = extractTotalAmount(fullText)

  return { amount, fullText }
}
