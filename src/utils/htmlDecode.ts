/**
 * HTML 엔티티를 디코딩하고 파이프(|)를 줄바꿈으로 변환합니다.
 * &quot; -> "
 * &amp; -> &
 * &lt; -> <
 * &gt; -> >
 * &#39; -> '
 * | -> \n (줄바꿈)
 */
export const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    // HTML 엔티티 디코딩 후 파이프를 줄바꿈으로 변환
    return textarea.value.replace(/\s*\|\s*/g, '\n').trim()
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표를 추가합니다.
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}
