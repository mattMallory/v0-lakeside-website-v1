export function formatMetricValue(amount: number, decimals: number) {
  if (decimals > 0) {
    return amount.toFixed(decimals)
  }

  return Math.round(amount).toLocaleString("en-US")
}

export function AnimatedMetricValue({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  displayValue,
  className,
}: {
  value?: number | null
  prefix?: string | null
  suffix?: string | null
  decimals?: number | null
  displayValue?: string | null
  className?: string
}) {
  if (displayValue) {
    return <span className={className}>{displayValue}</span>
  }

  const numericValue =
    value === null || value === undefined
      ? null
      : typeof value === "number"
        ? value
        : Number(value)

  if (numericValue === null || !Number.isFinite(numericValue)) {
    return <span className={className}>—</span>
  }

  const decimalPlaces = decimals ?? 0
  const formattedValue = formatMetricValue(numericValue, decimalPlaces)

  return (
    <span
      className={["case-study-metric-value inline-block min-w-[2ch]", className].filter(Boolean).join(" ")}
      data-metric-target={numericValue}
      data-metric-prefix={prefix ?? ""}
      data-metric-suffix={suffix ?? ""}
      data-metric-decimals={decimalPlaces}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
