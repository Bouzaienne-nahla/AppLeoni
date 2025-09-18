"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Users, CheckCircle, TrendingUp, Key } from "lucide-react"
import { useEffect, useState } from "react"

interface LockerStats {
  totalCasiers: number
  casiersOccupes: number
  casiersLibres: number
  employesActifs: number
  clesPerdues: number
}

export function StatsCards() {
  const [stats, setStats] = useState<LockerStats>({
    totalCasiers: 0,
    casiersOccupes: 0,
    casiersLibres: 0,
    employesActifs: 0,
    clesPerdues: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Données par défaut en cas d'erreur
          setStats({
            totalCasiers: 7000,
            casiersOccupes: 0,
            casiersLibres: 7000,
            employesActifs: 0,
            clesPerdues: 0,
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
        // Données par défaut
        setStats({
          totalCasiers: 7000,
          casiersOccupes: 0,
          casiersLibres: 7000,
          employesActifs: 0,
          clesPerdues: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const occupationRate = stats.totalCasiers > 0 ? Math.round((stats.casiersOccupes / stats.totalCasiers) * 100) : 0

  const statsCards = [
    {
      title: "Total Casiers",
      value: loading ? "..." : stats.totalCasiers.toLocaleString(),
      icon: Archive,
      description: "Casiers disponibles",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "100%",
    },
    {
      title: "Casiers Occupés",
      value: loading ? "..." : stats.casiersOccupes.toLocaleString(),
      icon: CheckCircle,
      description: `${occupationRate}% d'occupation`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: `${occupationRate}%`,
    },
    {
      title: "Casiers Libres",
      value: loading ? "..." : stats.casiersLibres.toLocaleString(),
      icon: Users,
      description: "Disponibles maintenant",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: `${100 - occupationRate}%`,
    },
    {
      title: "Clés Perdues",
      value: loading ? "..." : stats.clesPerdues.toString(),
      icon: Key,
      description: "Clés à remplacer",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: stats.clesPerdues > 0 ? "Action requise" : "OK",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat) => (
        <Card key={stat.title} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.description}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium text-green-500">{stat.trend}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
