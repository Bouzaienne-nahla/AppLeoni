"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Archive,
  Wrench,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react"

// Types pour les analytics industriels
interface OccupationData {
  mois: string
  taux: number
  total: number
  occupes: number
}

interface MaintenanceData {
  mois: string
  tickets: number
  cout: number
  tempsArret: number
}

interface DepartmentData {
  departement: string
  employes: number
  casiers: number
  taux: number
}

interface ZoneData {
  zone: string
  total: number
  occupes: number
  maintenance: number
  horsService: number
}

const occupationData: OccupationData[] = [
  { mois: "Jan", taux: 87, total: 7000, occupes: 6090 },
  { mois: "Fév", taux: 89, total: 7000, occupes: 6230 },
  { mois: "Mar", taux: 91, total: 7000, occupes: 6370 },
  { mois: "Avr", taux: 88, total: 7000, occupes: 6160 },
  { mois: "Mai", taux: 92, total: 7000, occupes: 6440 },
  { mois: "Jun", taux: 90, total: 7000, occupes: 6300 },
  { mois: "Jul", taux: 85, total: 7000, occupes: 5950 },
  { mois: "Aoû", taux: 83, total: 7000, occupes: 5810 },
  { mois: "Sep", taux: 94, total: 7000, occupes: 6580 },
  { mois: "Oct", taux: 93, total: 7000, occupes: 6510 },
  { mois: "Nov", taux: 91, total: 7000, occupes: 6370 },
  { mois: "Déc", taux: 89, total: 7000, occupes: 6230 },
]

const maintenanceData: MaintenanceData[] = [
  { mois: "Jan", tickets: 45, cout: 2850, tempsArret: 120 },
  { mois: "Fév", tickets: 38, cout: 2400, tempsArret: 95 },
  { mois: "Mar", tickets: 52, cout: 3200, tempsArret: 140 },
  { mois: "Avr", tickets: 41, cout: 2650, tempsArret: 110 },
  { mois: "Mai", tickets: 35, cout: 2200, tempsArret: 85 },
  { mois: "Jun", tickets: 48, cout: 2950, tempsArret: 125 },
  { mois: "Jul", tickets: 29, cout: 1800, tempsArret: 70 },
  { mois: "Aoû", tickets: 31, cout: 1950, tempsArret: 75 },
  { mois: "Sep", tickets: 44, cout: 2750, tempsArret: 115 },
  { mois: "Oct", tickets: 39, cout: 2450, tempsArret: 100 },
  { mois: "Nov", tickets: 42, cout: 2600, tempsArret: 105 },
  { mois: "Déc", tickets: 36, cout: 2250, tempsArret: 90 },
]

const departmentData: DepartmentData[] = [
  { departement: "Production", employes: 3200, casiers: 3150, taux: 98 },
  { departement: "Qualité", employes: 850, casiers: 840, taux: 99 },
  { departement: "Maintenance", employes: 420, casiers: 415, taux: 99 },
  { departement: "Logistique", employes: 680, casiers: 670, taux: 98 },
  { departement: "Administration", employes: 320, casiers: 310, taux: 97 },
  { departement: "R&D", employes: 280, casiers: 275, taux: 98 },
  { departement: "Sécurité", employes: 95, casiers: 90, taux: 95 },
]

const zoneData: ZoneData[] = [
  { zone: "Zone A", total: 1400, occupes: 1320, maintenance: 15, horsService: 8 },
  { zone: "Zone B", total: 1200, occupes: 1150, maintenance: 12, horsService: 5 },
  { zone: "Zone C", total: 1100, occupes: 1040, maintenance: 18, horsService: 7 },
  { zone: "Zone D", total: 950, occupes: 890, maintenance: 10, horsService: 3 },
  { zone: "Zone E", total: 800, occupes: 750, maintenance: 8, horsService: 4 },
  { zone: "Zone F", total: 750, occupes: 710, maintenance: 6, horsService: 2 },
  { zone: "Zone G", total: 650, occupes: 620, maintenance: 5, horsService: 1 },
  { zone: "Zone H", total: 150, occupes: 140, maintenance: 2, horsService: 0 },
]

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("12mois")
  const [selectedReport, setSelectedReport] = useState("occupation")

  // Calculs des KPIs
  const currentOccupation = occupationData[occupationData.length - 1]
  const previousOccupation = occupationData[occupationData.length - 2]
  const occupationTrend = currentOccupation.taux - previousOccupation.taux

  const currentMaintenance = maintenanceData[maintenanceData.length - 1]
  const previousMaintenance = maintenanceData[maintenanceData.length - 2]
  const maintenanceTrend = currentMaintenance.tickets - previousMaintenance.tickets

  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employes, 0)
  const totalAssignedLockers = departmentData.reduce((sum, dept) => sum + dept.casiers, 0)
  const globalAssignmentRate = Math.round((totalAssignedLockers / totalEmployees) * 100)

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentOccupation.taux}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {occupationTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(occupationTrend)}% vs mois précédent
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMaintenance.tickets}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {maintenanceTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              )}
              {Math.abs(maintenanceTrend)} vs mois précédent
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Maintenance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMaintenance.cout.toLocaleString()}€</div>
            <div className="text-xs text-muted-foreground">
              {(currentMaintenance.cout / currentMaintenance.tickets).toFixed(0)}€ par ticket
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Attribution</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalAssignmentRate}%</div>
            <div className="text-xs text-muted-foreground">
              {totalAssignedLockers.toLocaleString()} / {totalEmployees.toLocaleString()} employés
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles de filtrage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics Avancées</CardTitle>
              <CardDescription>Analyses détaillées et tendances des performances</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3mois">3 derniers mois</SelectItem>
                  <SelectItem value="6mois">6 derniers mois</SelectItem>
                  <SelectItem value="12mois">12 derniers mois</SelectItem>
                  <SelectItem value="24mois">24 derniers mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Graphiques et analyses */}
      <Tabs defaultValue="occupation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="occupation">Occupation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="departements">Départements</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="occupation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Taux d'Occupation</CardTitle>
                <CardDescription>Pourcentage d'occupation mensuel des casiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={occupationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Taux d'occupation"]}
                      labelFormatter={(label) => `Mois: ${label}`}
                    />
                    <Area type="monotone" dataKey="taux" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition Actuelle</CardTitle>
                <CardDescription>État des casiers en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Casiers Occupés</span>
                    <span className="text-sm text-muted-foreground">{currentOccupation.occupes.toLocaleString()}</span>
                  </div>
                  <Progress value={currentOccupation.taux} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentOccupation.occupes.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">Occupés</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {(currentOccupation.total - currentOccupation.occupes).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Libres</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets de Maintenance</CardTitle>
                <CardDescription>Évolution mensuelle des demandes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={maintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tickets" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coûts de Maintenance</CardTitle>
                <CardDescription>Évolution des coûts mensuels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={maintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}€`, "Coût"]} />
                    <Line type="monotone" dataKey="cout" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution par Département</CardTitle>
              <CardDescription>Répartition des casiers par service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.departement} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium">{dept.departement}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.casiers.toLocaleString()} casiers / {dept.employes.toLocaleString()} employés
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{dept.taux}%</div>
                      <Progress value={dept.taux} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Zone</CardTitle>
                <CardDescription>État des casiers par zone géographique</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="zone" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="occupes" stackId="a" fill="#10B981" />
                    <Bar dataKey="maintenance" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="horsService" stackId="a" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques par Zone</CardTitle>
                <CardDescription>Détail des performances par zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zoneData.slice(0, 5).map((zone) => {
                    const occupationRate = Math.round((zone.occupes / zone.total) * 100)
                    return (
                      <div key={zone.zone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{zone.zone}</div>
                          <div className="text-sm text-muted-foreground">{zone.total} casiers total</div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              occupationRate > 90 ? "default" : occupationRate > 80 ? "secondary" : "destructive"
                            }
                          >
                            {occupationRate}%
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">{zone.maintenance} maintenance</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rapports automatisés */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Automatisés</CardTitle>
          <CardDescription>Génération et planification de rapports périodiques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="font-medium">Rapport Mensuel</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Synthèse complète des performances mensuelles</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Générer Rapport
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-green-500" />
                <div className="font-medium">Rapport Hebdomadaire</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Suivi hebdomadaire des indicateurs clés</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Programmer
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div className="font-medium">Analyse Prédictive</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Prévisions et recommandations basées sur l'IA</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Analyser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
