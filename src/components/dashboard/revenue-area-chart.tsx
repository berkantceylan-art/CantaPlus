"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getRevenueChartData } from "@/lib/actions/dashboard"

export function RevenueAreaChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const result = await getRevenueChartData()
      setData(result)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full bg-primary/5 animate-pulse rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="h-full w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.length > 0 ? data : []}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOmni" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.705 0.213 47.604)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="oklch(0.705 0.213 47.604)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPlat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(255, 255, 255, 0.1)" stopOpacity={0.1} />
              <stop offset="95%" stopColor="rgba(255, 255, 255, 0.1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="4 4" 
            vertical={false} 
            stroke="oklch(0.3 0.05 264.665)" 
            strokeOpacity={0.1} 
          />
          
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "oklch(0.7 0.05 264.665)", fontWeight: "bold" }}
          />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "oklch(0.7 0.05 264.665)", fontWeight: "bold" }}
            tickFormatter={(value) => `₺${value}`}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 191, 0, 0.2)",
              borderRadius: "24px",
              fontSize: "10px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              color: "#fff"
            }}
            itemStyle={{ color: "#fff", fontWeight: "black", textTransform: "uppercase" }}
            labelStyle={{ display: "none" }}
          />

          <Area
            type="monotone"
            dataKey="site"
            name="ÇantaPlus"
            stroke="oklch(0.705 0.213 47.604)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorOmni)"
          />

          <Area
            type="monotone"
            dataKey="trendyol"
            name="Trendyol"
            stroke="rgba(242, 122, 26, 0.5)"
            strokeWidth={1}
            fillOpacity={0.1}
            fill="url(#colorPlat)"
          />

          <Area
            type="monotone"
            dataKey="hepsiburada"
            name="H.Burada"
            stroke="rgba(255, 96, 0, 0.5)"
            strokeWidth={1}
            fillOpacity={0.1}
            fill="url(#colorPlat)"
          />

          <Area
            type="monotone"
            dataKey="n11"
            name="N11"
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth={1}
            fillOpacity={0.1}
            fill="url(#colorPlat)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
