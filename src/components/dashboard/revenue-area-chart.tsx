"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const defaultData = [
  { name: "Pzt", site: 4000, trendyol: 2400, hepsiburada: 1200 },
  { name: "Sal", site: 3000, trendyol: 1398, hepsiburada: 2100 },
  { name: "Çar", site: 2000, trendyol: 9800, hepsiburada: 2290 },
  { name: "Per", site: 2780, trendyol: 3908, hepsiburada: 2000 },
  { name: "Cum", site: 1890, trendyol: 4800, hepsiburada: 2181 },
  { name: "Cmt", site: 2390, trendyol: 3800, hepsiburada: 2500 },
  { name: "Paz", site: 3490, trendyol: 4300, hepsiburada: 2100 },
]

export function RevenueAreaChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={defaultData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTrendyol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f27a1a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f27a1a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6000" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `₺${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="site"
            name="ÇantaPlus"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorSite)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="trendyol"
            name="Trendyol"
            stroke="#f27a1a"
            fillOpacity={1}
            fill="url(#colorTrendyol)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="hepsiburada"
            name="Hepsiburada"
            stroke="#ff6000"
            fillOpacity={1}
            fill="url(#colorHB)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
