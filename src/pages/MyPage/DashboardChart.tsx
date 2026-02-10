interface DashboardChartProps {
  connection: number // 0-30
  growth: number     // 0-30
  contribution: number // 0-30
  characterImageUrl?: string
}

function DashboardChart({ connection, growth, contribution, characterImageUrl }: DashboardChartProps) {
  const cx = 62
  const cy = 67

  // Three concentric rings: outer (connection), middle (growth), inner (contribution)
  const rings = [
    { r: 54, score: connection, color: '#074ED8', bgColor: '#E6EFFF' },
    { r: 40, score: growth, color: '#ABC8FF', bgColor: '#E6EFFF' },
    { r: 27, score: contribution, color: '#E6EFFF', bgColor: '#F3F6FB' },
  ]

  const strokeWidth = 13.3

  return (
    <div style={{ position: 'relative', width: '111px', height: '121px' }}>
      <svg
        viewBox="0 0 124 135"
        width="111"
        height="121"
        fill="none"
        style={{ display: 'block' }}
      >
        {rings.map(({ r, score, color, bgColor }, i) => {
          const circumference = 2 * Math.PI * r
          const progress = Math.min(score, 30) / 30
          const dashoffset = circumference * (1 - progress)

          return (
            <g key={i}>
              {/* Background ring */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke={bgColor}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={0.5}
              />
              {/* Filled ring */}
              {progress > 0 && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              )}
            </g>
          )
        })}
      </svg>
      {characterImageUrl && (
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '26px',
          width: '55px',
          height: '53px',
          overflow: 'hidden',
        }}>
          <img
            src={characterImageUrl}
            alt=""
            style={{
              position: 'absolute',
              top: '-8%',
              left: '-4%',
              width: '116%',
              height: '122%',
              maxWidth: 'none',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DashboardChart
