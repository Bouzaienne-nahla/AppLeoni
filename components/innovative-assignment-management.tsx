"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  UserCheck,
  Key,
  CheckCircle,
  RefreshCw,
  Download,
  QrCode,
  Scan,
  Eye,
  X,
  Zap,
  Brain,
  Smartphone,
  MapPin,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getAllCasiers, getAllEmployees } from "@/lib/data-service"

interface Assignment {
  id: string
  employeeId: string
  lockerId: string
  dateAssignment: string
  scanData: string
  aiConfidence: number
  status: "active" | "pending" | "expired" | "revoked"
  assignedBy: string
  location: { x: number; y: number }
  qrCode: string
}

export function InnovativeAssignmentManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [selectedLocker, setSelectedLocker] = useState<any>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const casiers = getAllCasiers()
  const employees = getAllEmployees()
  const availableLockers = casiers.filter((c) => c.statut === "libre")

  // Simulation du scannage IA
  const startAIScan = useCallback(async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulation progressive du scan
    const intervals = [
      { progress: 20, message: "Initialisation de la caméra IA..." },
      { progress: 40, message: "Détection des visages..." },
      { progress: 60, message: "Analyse biométrique..." },
      { progress: 80, message: "Vérification de l'identité..." },
      { progress: 100, message: "Scan terminé avec succès!" },
    ]

    for (const interval of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setScanProgress(interval.progress)

      if (interval.progress === 100) {
        // Simulation de résultats IA
        const mockEmployee = employees[Math.floor(Math.random() * employees.length)]
        const mockLocker = availableLockers[Math.floor(Math.random() * availableLockers.length)]

        setAiAnalysis({
          employee: mockEmployee,
          locker: mockLocker,
          confidence: 95.7,
          biometricMatch: true,
          recommendations: [
            "Employé identifié avec haute confiance",
            "Casier optimal trouvé dans sa zone",
            "Aucun conflit détecté",
          ],
        })

        setSelectedEmployee(mockEmployee)
        setSelectedLocker(mockLocker)
      }
    }

    setIsScanning(false)

    toast({
      title: "Scan IA Terminé",
      description: "Employé identifié avec 95.7% de confiance",
    })
  }, [employees, availableLockers])

  // Créer un assignement avec IA
  const createAIAssignment = useCallback(() => {
    if (!selectedEmployee || !selectedLocker || !aiAnalysis) return

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      employeeId: selectedEmployee.matricule,
      lockerId: selectedLocker.numeroCasier.toString(),
      dateAssignment: new Date().toISOString(),
      scanData: JSON.stringify(aiAnalysis),
      aiConfidence: aiAnalysis.confidence,
      status: "active",
      assignedBy: "IA System",
      location: { x: Math.random() * 100, y: Math.random() * 100 },
      qrCode: `QR-${Date.now()}`,
    }

    setAssignments((prev) => [...prev, newAssignment])

    // Reset
    setAiAnalysis(null)
    setSelectedEmployee(null)
    setSelectedLocker(null)

    toast({
      title: "Assignement Créé",
      description: `Casier ${selectedLocker.numeroCasier} assigné à ${selectedEmployee.nom} par IA`,
    })
  }, [selectedEmployee, selectedLocker, aiAnalysis])

  const getStatusBadge = (status: Assignment["status"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      revoked: "bg-gray-100 text-gray-800",
    }
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const getConfidenceBadge = (confidence: number) => {
    const color = confidence >= 90 ? "text-green-600" : confidence >= 70 ? "text-yellow-600" : "text-red-600"
    return <span className={`font-medium ${color}`}>{confidence}%</span>
  }

  return (
    <div className="space-y-6">
      {/* Statistiques innovantes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans IA Aujourd'hui</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">247</div>
            <p className="text-xs text-blue-600">+12% vs hier</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignements Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignments.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-green-600">Avec IA</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiance IA Moyenne</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94.2%</div>
            <p className="text-xs text-purple-600">Très haute précision</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Codes Générés</CardTitle>
            <QrCode className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1,847</div>
            <p className="text-xs text-orange-600">Codes uniques</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">2.3s</div>
            <p className="text-xs text-teal-600">Par assignement</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale innovante */}
      <Tabs defaultValue="ai-scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-scan">Scan IA</TabsTrigger>
          <TabsTrigger value="active">Assignements Actifs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="qr-management">QR Management</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-scan">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scanner IA */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Scanner IA Avancé
                </CardTitle>
                <CardDescription>
                  Reconnaissance faciale et assignement automatique avec intelligence artificielle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isScanning && !aiAnalysis && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scan className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Prêt pour le Scan IA</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Utilisez notre technologie IA pour identifier automatiquement l'employé et assigner le casier
                      optimal
                    </p>
                    <Button onClick={startAIScan} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Brain className="h-4 w-4 mr-2" />
                      Démarrer le Scan IA
                    </Button>
                  </div>
                )}

                {isScanning && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Brain className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Analyse IA en cours...</h3>
                    </div>
                    <Progress value={scanProgress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      {scanProgress < 20 && "Initialisation de la caméra IA..."}
                      {scanProgress >= 20 && scanProgress < 40 && "Détection des visages..."}
                      {scanProgress >= 40 && scanProgress < 60 && "Analyse biométrique..."}
                      {scanProgress >= 60 && scanProgress < 80 && "Vérification de l'identité..."}
                      {scanProgress >= 80 && "Finalisation..."}
                    </p>
                  </div>
                )}

                {aiAnalysis && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-green-800">Identification Réussie</span>
                        <Badge className="bg-green-100 text-green-800 ml-auto">
                          {getConfidenceBadge(aiAnalysis.confidence)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Employé Identifié</p>
                          <p className="text-lg font-semibold">{aiAnalysis.employee?.nom}</p>
                          <p className="text-sm text-gray-500">Mat: {aiAnalysis.employee?.matricule}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Casier Recommandé</p>
                          <p className="text-lg font-semibold">#{aiAnalysis.locker?.numeroCasier}</p>
                          <p className="text-sm text-gray-500">{aiAnalysis.locker?.zone}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Recommandations IA:</p>
                        {aiAnalysis.recommendations?.map((rec: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button onClick={createAIAssignment} className="flex-1">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Confirmer l'Assignement
                        </Button>
                        <Button variant="outline" onClick={() => setAiAnalysis(null)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Nouveau Scan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualisation en temps réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  Visualisation Temps Réel
                </CardTitle>
                <CardDescription>Carte interactive des assignements et activité en direct</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg p-6 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50"></div>
                  <div className="relative z-10 text-center">
                    <MapPin className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Carte Interactive</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visualisation 3D des casiers et assignements en temps réel
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/80 rounded-lg p-3">
                        <div className="font-semibold text-green-600">{assignments.length}</div>
                        <div className="text-xs">Assignements</div>
                      </div>
                      <div className="bg-white/80 rounded-lg p-3">
                        <div className="font-semibold text-blue-600">{availableLockers.length}</div>
                        <div className="text-xs">Casiers Libres</div>
                      </div>
                    </div>
                  </div>

                  {/* Points animés pour simuler l'activité */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assignements Actifs avec IA</CardTitle>
                  <CardDescription>Tous les assignements créés par le système IA</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Générer QR
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par employé, casier ou QR code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employé</TableHead>
                        <TableHead>Casier</TableHead>
                        <TableHead>Date Assignement</TableHead>
                        <TableHead>Confiance IA</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => {
                        const employee = employees.find((e) => e.matricule.toString() === assignment.employeeId)
                        const locker = casiers.find((c) => c.numeroCasier.toString() === assignment.lockerId)

                        return (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              {employee && (
                                <div>
                                  <div className="font-medium">{employee.nom}</div>
                                  <div className="text-sm text-muted-foreground">Mat: {employee.matricule}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {locker && (
                                <div>
                                  <div className="font-medium">#{locker.numeroCasier}</div>
                                  <div className="text-sm text-muted-foreground">{locker.zone}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{new Date(assignment.dateAssignment).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                {getConfidenceBadge(assignment.aiConfidence)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {assignment.qrCode}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Performance IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Précision de reconnaissance</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <Progress value={94.2} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps de traitement moyen</span>
                    <span className="font-semibold">2.3s</span>
                  </div>
                  <Progress value={85} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assignements automatiques</span>
                    <span className="font-semibold">89%</span>
                  </div>
                  <Progress value={89} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "Il y a 2 min", action: "Scan IA réussi", user: "Jean Dupont", confidence: 96.5 },
                    { time: "Il y a 5 min", action: "Assignement créé", user: "Marie Martin", confidence: 94.2 },
                    { time: "Il y a 8 min", action: "QR Code généré", user: "Pierre Bernard", confidence: 91.8 },
                    { time: "Il y a 12 min", action: "Scan IA réussi", user: "Sophie Rousseau", confidence: 97.1 },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.user} • {activity.time}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qr-management">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-orange-500" />
                Gestion des QR Codes
              </CardTitle>
              <CardDescription>Génération et gestion des codes QR pour les assignements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Système QR Code Avancé</p>
                <p className="text-sm mb-4">Génération automatique de QR codes uniques pour chaque assignement</p>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Codes Uniques</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-blue-500" />
                    <span>Scan Mobile</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Key className="h-3 w-3 text-purple-500" />
                    <span>Accès Sécurisé</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
