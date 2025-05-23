"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

export default function SentimentChart({ results }) {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>
  }

  // Count sentiments
  const sentimentCounts = results.reduce((acc, item) => {
    const sentiment = item.sentiment
    acc[sentiment] = (acc[sentiment] || 0) + 1
    return acc
  }, {})

  const total = results.length

  const chartData = Object.keys(sentimentCounts).map((key) => ({
    name: key,
    value: sentimentCounts[key],
    percentage: ((sentimentCounts[key] / total) * 100).toFixed(1),
  }))

  const COLORS = {
    Positive: "#10b981",
    Negative: "#ef4444",
    Neutral: "#6b7280",
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, payload: entry } = payload[0]
      return (
        <div className="bg-white border rounded p-2 shadow-sm text-sm">
          <p className="font-semibold">{name}</p>
          <p>Count: {value}</p>
          <p>Percentage: {entry.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#9333ea"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <p className="mt-4 text-gray-600 text-sm">
        Total reviews: <span className="font-semibold">{total}</span>
      </p>
    </div>
  )
}
