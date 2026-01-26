// Google Cloud Vision OCR API Service
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

/**
 * 이미지 파일을 base64로 변환
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // data:image/...;base64, 부분 제거
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 텍스트에서 합계 금액 추출
 */
function extractTotalAmount(text: string): number {
  // 합계, 합 계, 총액, 총합, 결제금액, 카드결제 등의 패턴 탐색
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

  // 패턴 못 찾을 경우 가장 큰 숫자를 합계로 추정
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

/**
 * Google Vision API를 사용하여 영수증에서 금액 인식
 */
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
