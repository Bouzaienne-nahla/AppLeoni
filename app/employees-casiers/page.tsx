"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Archive, Search, Plus, Key, UserCheck, Filter } from "lucide-react"
import { useState, useEffect } from "react"

interface Employee {
  matricule: string
  nom: string
  prenom: string
  departement: string
  numeroCasier?: number
  numeroClé?: string
  dateAttribution?: string
}

interface Casier {
  numero: number
  numeroClé: string
  statut: "libre" | "occupé" | "maintenance"
  employé?: {
    matricule: string
    nom: string
    prenom: string
  }
}

export default function EmployeesCasiersPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [casiers, setCasiers] = useState<Casier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, casiersRes] = await Promise.all([fetch("/api/employees"), fetch("/api/casiers")])

        if (employeesRes.ok && casiersRes.ok) {
          const employeesData = await employeesRes.json()
          const casiersData = await casiersRes.json()
          setEmployees(Array.isArray(employeesData) ? employeesData : [])
          setCasiers(Array.isArray(casiersData) ? casiersData : [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
        // Données d'exemple pour le développement
        setEmployees([
          {
            matricule: "LEO001",
            nom: "Dupont",
            prenom: "Jean",
            departement: "Production",
            numeroCasier: 1001,
            numeroClé: "CLE-1001",
          },
        ])
        setCasiers([
          {
            numero: 1001,
            numeroClé: "CLE-1001",
            statut: "occupé",
            employé: { matricule: "LEO001", nom: "Dupont", prenom: "Jean" },
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCasiers = casiers.filter(
    (casier) =>
      casier.numero.toString().includes(searchTerm) ||
      casier.numeroClé.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Employés & Casiers</h1>
            <p className="text-gray-600">Système unifié de gestion des employés et attribution des casiers</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Employé
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Employés Total</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Avec Casier</p>
                  <p className="text-2xl font-bold">{employees.filter((e) => e.numeroCasier).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Casiers Occupés</p>
                  <p className="text-2xl font-bold">{casiers.filter((c) => c.statut === "occupé").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Key className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Casiers Libres</p>
                  <p className="text-2xl font-bold">{casiers.filter((c) => c.statut === "libre").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, matricule ou numéro de casier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Onglets Employés / Casiers */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="casiers">Casiers</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Employés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p>Chargement...</p>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <div key={employee.matricule} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {employee.prenom} {employee.nom}
                            </h3>
                            <p className="text-sm text-gray-600">Matricule: {employee.matricule}</p>
                            <p className="text-sm text-gray-600">Département: {employee.departement}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {employee.numeroCasier ? (
                            <div>
                              <Badge variant="secondary">Casier #{employee.numeroCasier}</Badge>
                              <p className="text-xs text-gray-500 mt-1">Clé: {employee.numeroClé}</p>
                            </div>
                          ) : (
                            <Badge variant="outline">Sans casier</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="casiers">
            <Card>
              <CardHeader>
                <CardTitle>État des Casiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    <p>Chargement...</p>
                  ) : (
                    filteredCasiers.map((casier) => (
                      <div key={casier.numero} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Casier #{casier.numero}</h3>
                          <Badge
                            variant={
                              casier.statut === "libre"
                                ? "secondary"
                                : casier.statut === "occupé"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {casier.statut}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Clé: {casier.numeroClé}</p>
                        {casier.employé && (
                          <div className="text-sm">
                            <p className="font-medium">
                              {casier.employé.prenom} {casier.employé.nom}
                            </p>
                            <p className="text-gray-600">Mat: {casier.employé.matricule}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
