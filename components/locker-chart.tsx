"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Lun", occupes: 165, libres: 83 },
  { name: "Mar", occupes: 178, libres: 70 },
  { name: "Mer", occupes: 186, libres: 62 },
  { name: "Jeu", occupes: 192, libres: 56 },
  { name: "Ven", occupes: 145, libres: 103 },
  { name: "Sam", occupes: 89, libres: 159 },
  { name: "Dim", occupes: 67, libres: 181 },
]

export function LockerChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Occupation Hebdomadaire</CardTitle>
        <CardDescription className="text-muted-foreground">
          Évolution de l'occupation des casiers sur 7 jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-muted-foreground" tick={{ fontSize: 12 }} />
            <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="occupes" fill="hsl(var(--chart-1))" name="Occupés" />
            <Bar dataKey="libres" fill="hsl(var(--chart-2))" name="Libres" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
