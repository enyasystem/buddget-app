"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("relative", className)} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ResponsiveContainer>>(
  ({ className, children, ...props }, ref) => {
    return (
      <ResponsiveContainer width="100%" height="100%" {...props}>
        {children}
      </ResponsiveContainer>
    )
  },
)
Chart.displayName = "Chart"

interface ChartPieProps {
  data: any[]
  dataKey: string
  nameKey: string
  colors: string[]
  paddingAngle?: number
  cornerRadius?: number
  children: React.ReactNode
}

const ChartPie = ({ data, dataKey, nameKey, colors, paddingAngle, cornerRadius, children }: ChartPieProps) => {
  return (
    <PieChart>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={paddingAngle}
        cornerRadius={cornerRadius}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      {children}
    </PieChart>
  )
}
ChartPie.displayName = "ChartPie"

interface ChartTooltipContentProps {
  className?: string
  children: React.ReactNode
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-2 rounded-md", className)} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

interface ChartTooltipItemProps {
  label: string
  value: (props: any) => string
}

const ChartTooltipItem = ({ label, value }: ChartTooltipItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm font-semibold ml-2">{value}</span>
    </div>
  )
}
ChartTooltipItem.displayName = "ChartTooltipItem"

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <Tooltip content={children} />
}
ChartTooltip.displayName = "ChartTooltip"

interface ChartLegendProps extends React.ComponentPropsWithoutRef<typeof Legend> {
  className?: string
}

const ChartLegend = ({ className, ...props }: ChartLegendProps) => {
  return <Legend className={cn("flex items-center justify-center", className)} {...props} />
}
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps {
  name: string
  color: string
}

const ChartLegendItem = ({ name, color }: ChartLegendItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm">{name}</span>
    </div>
  )
}
ChartLegendItem.displayName = "ChartLegendItem"

export {
  Chart,
  ChartContainer,
  ChartPie,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartLegend,
  ChartLegendItem,
}
