"use client"

import { useState, useEffect } from "react"
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
import { Search, Plus, Edit, Trash2, Key, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types pour la gestion industrielle
interface Employee {
  id: string
  matricule: string
  nom: string
  prenom: string
  departement: string
  poste: string
  equipe: string
  dateEmbauche: string
  casierAttribue?: string
  statut: "actif" | "conge" | "suspendu" | "demission"
}

interface Locker {
  numero: string
  zone: string
  etage: number
  statut: "libre" | "occupe" | "maintenance" | "hors_service"
  employe?: string
  dateAttribution?: string
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [lockers, setLockers] = useState<Locker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("tous")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    matricule: "",
    departement: "",
    poste: "",
    equipe: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Remplacer par vos endpoints API Leoni
        const [employeesResponse, lockersResponse] = await Promise.all([
          fetch("/api/employees"), // Votre API Leoni
          fetch("/api/lockers"), // Votre API Leoni
        ])

        if (employeesResponse.ok && lockersResponse.ok) {
          const employeesData = await employeesResponse.json()
          const lockersData = await lockersResponse.json()

          setEmployees(Array.isArray(employeesData) ? employeesData : [])
          setLockers(Array.isArray(lockersData) ? lockersData : [])
        } else {
          console.log("[v0] API non disponible, utilisation de données par défaut")
          setEmployees([
            {
              id: "1",
              matricule: "LEO001234",
              nom: "Dupont",
              prenom: "Jean",
              departement: "Production",
              poste: "Opérateur",
              equipe: "Equipe A",
              dateEmbauche: "2023-01-15",
              casierAttribue: "A-101",
              statut: "actif" as const,
            },
            {
              id: "2",
              matricule: "LEO001235",
              nom: "Martin",
              prenom: "Marie",
              departement: "Qualite",
              poste: "Technicienne",
              equipe: "Equipe B",
              dateEmbauche: "2023-02-20",
              statut: "actif" as const,
            },
          ])
          setLockers([])
        }
      } catch (err) {
        console.log("[v0] Erreur de connexion, utilisation de données par défaut")
        setError("Connexion à la base de données indisponible - Mode démo")
        setEmployees([
          {
            id: "demo1",
            matricule: "LEO999999",
            nom: "Demo",
            prenom: "Utilisateur",
            departement: "Production",
            poste: "Opérateur",
            equipe: "Equipe A",
            dateEmbauche: "2024-01-01",
            statut: "actif" as const,
          },
        ])
        setLockers([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddEmployee = async () => {
    // Validation des champs requis
    if (!formData.nom || !formData.prenom || !formData.matricule || !formData.departement || !formData.equipe) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dateEmbauche: new Date().toISOString().split("T")[0],
          statut: "actif",
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'employé")
      }

      const newEmployee = await response.json()

      // Mettre à jour l'état local
      setEmployees((prev) => [...prev, newEmployee])

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        matricule: "",
        departement: "",
        poste: "",
        equipe: "",
      })

      setIsDialogOpen(false)

      toast({
        title: "Succès",
        description: `Employé ${formData.prenom} ${formData.nom} ajouté avec succès`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'employé à la base de données",
        variant: "destructive",
      })
      console.error("Erreur:", error)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      const employee = employees.find((emp) => emp.id === employeeId)
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))

      if (employee) {
        toast({
          title: "Employé supprimé",
          description: `${employee.prenom} ${employee.nom} a été retiré du système`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'employé",
        variant: "destructive",
      })
      console.error("Erreur:", error)
    }
  }

  const filteredEmployees = (employees || []).filter((emp) => {
    const matchesSearch =
      emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "tous" || emp.departement === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusBadge = (statut: Employee["statut"]) => {
    const variants = {
      actif: "bg-green-100 text-green-800",
      conge: "bg-yellow-100 text-yellow-800",
      suspendu: "bg-red-100 text-red-800",
      demission: "bg-gray-100 text-gray-800",
    }
    return <Badge className={variants[statut]}>{statut.toUpperCase()}</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des données...</div>
  }

  if (error) {
    return <div className="text-red-600 p-8">Erreur: {error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés Actifs</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(employees || []).filter((emp) => emp.statut === "actif").length}</div>
            <p className="text-xs text-muted-foreground">Total dans le système</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casiers Attribués</CardTitle>
            <Key className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,234</div>
            <p className="text-xs text-muted-foreground">89% d'occupation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Congé</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">153</div>
            <p className="text-xs text-muted-foreground">Congés d'été</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problèmes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Casiers bloqués</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Employés et Casiers</CardTitle>
          <CardDescription>Recherchez et gérez l'attribution des casiers pour tous les employés Leoni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, prénom ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les départements</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Qualite">Qualité</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Logistique">Logistique</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Employé
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un Employé</DialogTitle>
                  <DialogDescription>Enregistrer un nouvel employé dans le système</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        placeholder="Nom de famille"
                        value={formData.nom}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        placeholder="Prénom"
                        value={formData.prenom}
                        onChange={(e) => setFormData((prev) => ({ ...prev, prenom: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="matricule">Matricule *</Label>
                    <Input
                      id="matricule"
                      placeholder="LEO001XXX"
                      value={formData.matricule}
                      onChange={(e) => setFormData((prev) => ({ ...prev, matricule: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="poste">Poste</Label>
                    <Input
                      id="poste"
                      placeholder="Opérateur, Technicien..."
                      value={formData.poste}
                      onChange={(e) => setFormData((prev) => ({ ...prev, poste: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departement">Département *</Label>
                      <Select
                        value={formData.departement}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, departement: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Production">Production</SelectItem>
                          <SelectItem value="Qualite">Qualité</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Logistique">Logistique</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="equipe">Équipe *</Label>
                      <Select
                        value={formData.equipe}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, equipe: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Equipe A">Équipe A</SelectItem>
                          <SelectItem value="Equipe B">Équipe B</SelectItem>
                          <SelectItem value="Equipe C">Équipe C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddEmployee}>
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tableau des employés */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead>Casier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono text-sm">{employee.matricule}</TableCell>
                    <TableCell className="font-medium">
                      {employee.prenom} {employee.nom}
                    </TableCell>
                    <TableCell>{employee.departement}</TableCell>
                    <TableCell>{employee.equipe}</TableCell>
                    <TableCell>
                      {employee.casierAttribue ? (
                        <Badge variant="outline">{employee.casierAttribue}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Non attribué</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(employee.statut)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
