"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Search,
  Plus,
  UserCheck,
  Key,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Eye,
  X,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types pour la gestion des attributions
interface Employee {
  id: string
  matricule: string
  nom: string
  prenom: string
  departement: string
  poste: string
  photo?: string
  statut: "actif" | "conge" | "suspendu"
}

interface Locker {
  id: string
  numero: string
  zone: string
  etage: number
  statut: "libre" | "occupe" | "maintenance" | "reserve"
  type: "standard" | "grand" | "petit" | "special"
}

interface Assignment {
  id: string
  employeeId: string
  lockerId: string
  dateAttribution: string
  photoVerification: string
  statut: "active" | "pending" | "expired" | "revoked"
  assignedBy: string
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    matricule: "LEO001234",
    nom: "Dupont",
    prenom: "Jean",
    departement: "Production",
    poste: "Opérateur",
    statut: "actif",
  },
  {
    id: "2",
    matricule: "LEO001235",
    nom: "Martin",
    prenom: "Marie",
    departement: "Qualité",
    poste: "Technicienne",
    statut: "actif",
  },
]

const mockLockers: Locker[] = [
  {
    id: "1",
    numero: "A-101",
    zone: "Zone A",
    etage: 1,
    statut: "libre",
    type: "standard",
  },
  {
    id: "2",
    numero: "A-102",
    zone: "Zone A",
    etage: 1,
    statut: "libre",
    type: "standard",
  },
  {
    id: "3",
    numero: "B-205",
    zone: "Zone B",
    etage: 2,
    statut: "libre",
    type: "grand",
  },
]

export function AssignmentManagement() {
  const [employees] = useState<Employee[]>(mockEmployees)
  const [lockers] = useState<Locker[]>(mockLockers)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Démarrer la caméra
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error)
      toast({
        title: "Erreur Caméra",
        description: "Impossible d'accéder à la caméra. Vérifiez les permissions.",
        variant: "destructive",
      })
    }
  }, [])

  // Arrêter la caméra
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }, [])

  // Capturer une photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(photoDataUrl)
        stopCamera()

        toast({
          title: "Photo Capturée",
          description: "Photo de vérification enregistrée avec succès",
        })
      }
    }
  }, [stopCamera])

  // Créer une nouvelle attribution
  const handleCreateAssignment = async () => {
    if (!selectedEmployee || !selectedLocker || !capturedPhoto) {
      toast({
        title: "Informations Manquantes",
        description: "Veuillez sélectionner un employé, un casier et prendre une photo",
        variant: "destructive",
      })
      return
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      employeeId: selectedEmployee.id,
      lockerId: selectedLocker.id,
      dateAttribution: new Date().toISOString(),
      photoVerification: capturedPhoto,
      statut: "active",
      assignedBy: "Admin System",
    }

    setAssignments((prev) => [...prev, newAssignment])

    // Réinitialiser le formulaire
    setSelectedEmployee(null)
    setSelectedLocker(null)
    setCapturedPhoto(null)
    setIsAssignmentDialogOpen(false)

    toast({
      title: "Attribution Créée",
      description: `Casier ${selectedLocker.numero} attribué à ${selectedEmployee.prenom} ${selectedEmployee.nom}`,
    })
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const availableLockers = lockers.filter(
    (locker) =>
      locker.statut === "libre" &&
      !assignments.some((assignment) => assignment.lockerId === locker.id && assignment.statut === "active"),
  )

  const getStatusBadge = (statut: Assignment["statut"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      revoked: "bg-gray-100 text-gray-800",
    }
    return <Badge className={variants[statut]}>{statut.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Statistiques des attributions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attributions Actives</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignments.filter((a) => a.statut === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Casiers attribués</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casiers Disponibles</CardTitle>
            <Key className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availableLockers.length}</div>
            <p className="text-xs text-muted-foreground">Prêts à attribuer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assignments.filter((a) => a.statut === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Vérifications requises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photos Vérifiées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">Identités confirmées</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale */}
      <Tabs defaultValue="assign" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assign">Nouvelle Attribution</TabsTrigger>
          <TabsTrigger value="active">Attributions Actives</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="assign">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attribution de Casier avec Vérification Photo</CardTitle>
                  <CardDescription>Processus sécurisé d'attribution avec capture photo obligatoire</CardDescription>
                </div>
                <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Attribution
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Attribution Sécurisée de Casier</DialogTitle>
                      <DialogDescription>
                        Sélectionnez un employé, un casier et prenez une photo de vérification
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                      {/* Sélection employé et casier */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="employee">Employé</Label>
                          <Select
                            value={selectedEmployee?.id || ""}
                            onValueChange={(value) => {
                              const employee = employees.find((e) => e.id === value)
                              setSelectedEmployee(employee || null)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un employé" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.prenom} {employee.nom} - {employee.matricule}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="locker">Casier Disponible</Label>
                          <Select
                            value={selectedLocker?.id || ""}
                            onValueChange={(value) => {
                              const locker = availableLockers.find((l) => l.id === value)
                              setSelectedLocker(locker || null)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un casier" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLockers.map((locker) => (
                                <SelectItem key={locker.id} value={locker.id}>
                                  {locker.numero} - {locker.zone} (Étage {locker.etage})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedEmployee && (
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Informations Employé</h4>
                            <p className="text-sm">
                              <strong>Nom:</strong> {selectedEmployee.prenom} {selectedEmployee.nom}
                            </p>
                            <p className="text-sm">
                              <strong>Matricule:</strong> {selectedEmployee.matricule}
                            </p>
                            <p className="text-sm">
                              <strong>Département:</strong> {selectedEmployee.departement}
                            </p>
                            <p className="text-sm">
                              <strong>Poste:</strong> {selectedEmployee.poste}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Capture photo */}
                      <div className="space-y-4">
                        <div>
                          <Label>Photo de Vérification</Label>
                          <div className="border rounded-lg p-4 bg-muted">
                            {!isCameraActive && !capturedPhoto && (
                              <div className="text-center py-8">
                                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-4">
                                  Prenez une photo de l'employé pour vérification
                                </p>
                                <Button onClick={startCamera}>
                                  <Camera className="h-4 w-4 mr-2" />
                                  Démarrer la Caméra
                                </Button>
                              </div>
                            )}

                            {isCameraActive && (
                              <div className="space-y-4">
                                <video
                                  ref={videoRef}
                                  autoPlay
                                  playsInline
                                  className="w-full rounded-lg"
                                  style={{ maxHeight: "300px" }}
                                />
                                <div className="flex gap-2">
                                  <Button onClick={capturePhoto} className="flex-1">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Capturer
                                  </Button>
                                  <Button variant="outline" onClick={stopCamera}>
                                    <X className="h-4 w-4 mr-2" />
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            )}

                            {capturedPhoto && (
                              <div className="space-y-4">
                                <img
                                  src={capturedPhoto || "/placeholder.svg"}
                                  alt="Photo de vérification"
                                  className="w-full rounded-lg"
                                  style={{ maxHeight: "300px", objectFit: "cover" }}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setCapturedPhoto(null)
                                      startCamera()
                                    }}
                                    className="flex-1"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reprendre
                                  </Button>
                                  <Button variant="outline" onClick={() => setCapturedPhoto(null)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={handleCreateAssignment}
                          className="w-full"
                          disabled={!selectedEmployee || !selectedLocker || !capturedPhoto}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Créer l'Attribution
                        </Button>
                      </div>
                    </div>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Système d'Attribution Sécurisé</p>
                <p className="text-sm mb-4">
                  Cliquez sur "Nouvelle Attribution" pour commencer le processus avec vérification photo
                </p>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Vérification Photo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Key className="h-3 w-3 text-blue-500" />
                    <span>Attribution Automatique</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-purple-500" />
                    <span>Traçabilité Complète</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Attributions Actives</CardTitle>
              <CardDescription>Liste des casiers actuellement attribués</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, matricule ou numéro de casier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employé</TableHead>
                        <TableHead>Casier</TableHead>
                        <TableHead>Date Attribution</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Photo</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => {
                        const employee = employees.find((e) => e.id === assignment.employeeId)
                        const locker = lockers.find((l) => l.id === assignment.lockerId)

                        return (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              {employee && (
                                <div>
                                  <div className="font-medium">
                                    {employee.prenom} {employee.nom}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{employee.matricule}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {locker && (
                                <div>
                                  <div className="font-medium">{locker.numero}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {locker.zone} - Étage {locker.etage}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{new Date(assignment.dateAttribution).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>{getStatusBadge(assignment.statut)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Key className="h-4 w-4" />
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

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Attributions</CardTitle>
              <CardDescription>Toutes les attributions passées et présentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4" />
                <p>Historique complet des attributions</p>
                <p className="text-sm">Fonctionnalité en développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
