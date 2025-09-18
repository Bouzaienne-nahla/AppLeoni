"use client"

import { useState } from "react"
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
import { Search, Plus, Edit, Key, Lock, Unlock, MapPin, Filter, Grid, List } from "lucide-react"

// Types pour la gestion des casiers
interface Locker {
  id: string
  numero: string
  zone: string
  etage: number
  rangee: string
  position: number
  type: "standard" | "grand" | "petit" | "special"
  statut: "libre" | "occupe" | "maintenance" | "hors_service" | "reserve"
  employe?: {
    nom: string
    prenom: string
    matricule: string
    departement: string
  }
  dateAttribution?: string
  dateLiberation?: string
  dernierAcces?: string
  serrure: {
    type: "electronique" | "mecanique" | "biometrique" | "rfid"
    batterie?: number
    derniereMaintenance?: string
  }
  dimensions: {
    largeur: number
    hauteur: number
    profondeur: number
  }
}

const mockLockers: Locker[] = [
  {
    id: "1",
    numero: "A-101",
    zone: "Zone A",
    etage: 1,
    rangee: "A",
    position: 1,
    type: "standard",
    statut: "occupe",
    employe: {
      nom: "Dubois",
      prenom: "Jean",
      matricule: "LEO001234",
      departement: "Production",
    },
    dateAttribution: "2024-01-15",
    dernierAcces: "2024-01-16T08:15:23",
    serrure: {
      type: "electronique",
      batterie: 85,
      derniereMaintenance: "2024-01-10",
    },
    dimensions: {
      largeur: 30,
      hauteur: 40,
      profondeur: 50,
    },
  },
  {
    id: "2",
    numero: "A-102",
    zone: "Zone A",
    etage: 1,
    rangee: "A",
    position: 2,
    type: "standard",
    statut: "libre",
    serrure: {
      type: "electronique",
      batterie: 92,
      derniereMaintenance: "2024-01-12",
    },
    dimensions: {
      largeur: 30,
      hauteur: 40,
      profondeur: 50,
    },
  },
  {
    id: "3",
    numero: "B-205",
    zone: "Zone B",
    etage: 2,
    rangee: "B",
    position: 5,
    type: "grand",
    statut: "maintenance",
    serrure: {
      type: "mecanique",
      derniereMaintenance: "2024-01-14",
    },
    dimensions: {
      largeur: 40,
      hauteur: 60,
      profondeur: 60,
    },
  },
  {
    id: "4",
    numero: "C-312",
    zone: "Zone C",
    etage: 3,
    rangee: "C",
    position: 12,
    type: "standard",
    statut: "hors_service",
    serrure: {
      type: "electronique",
      batterie: 0,
      derniereMaintenance: "2024-01-05",
    },
    dimensions: {
      largeur: 30,
      hauteur: 40,
      profondeur: 50,
    },
  },
]

export function LockerManagement() {
  const [lockers] = useState<Locker[]>(mockLockers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState<string>("toutes")
  const [selectedStatus, setSelectedStatus] = useState<string>("tous")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch =
      locker.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locker.employe?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locker.employe?.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === "toutes" || locker.zone === selectedZone
    const matchesStatus = selectedStatus === "tous" || locker.statut === selectedStatus
    return matchesSearch && matchesZone && matchesStatus
  })

  const getStatusBadge = (statut: Locker["statut"]) => {
    const variants = {
      libre: "bg-green-100 text-green-800",
      occupe: "bg-blue-100 text-blue-800",
      maintenance: "bg-orange-100 text-orange-800",
      hors_service: "bg-red-100 text-red-800",
      reserve: "bg-purple-100 text-purple-800",
    }
    const labels = {
      libre: "LIBRE",
      occupe: "OCCUPÉ",
      maintenance: "MAINTENANCE",
      hors_service: "HORS SERVICE",
      reserve: "RÉSERVÉ",
    }
    return <Badge className={variants[statut]}>{labels[statut]}</Badge>
  }

  const getTypeBadge = (type: Locker["type"]) => {
    const variants = {
      standard: "bg-gray-100 text-gray-800",
      grand: "bg-blue-100 text-blue-800",
      petit: "bg-yellow-100 text-yellow-800",
      special: "bg-purple-100 text-purple-800",
    }
    return (
      <Badge variant="outline" className={variants[type]}>
        {type.toUpperCase()}
      </Badge>
    )
  }

  // Statistiques des casiers
  const totalLockers = lockers.length
  const occupiedLockers = lockers.filter((l) => l.statut === "occupe").length
  const freeLockers = lockers.filter((l) => l.statut === "libre").length
  const maintenanceLockers = lockers.filter((l) => l.statut === "maintenance").length
  const outOfServiceLockers = lockers.filter((l) => l.statut === "hors_service").length

  return (
    <div className="space-y-6">
      {/* Statistiques des casiers */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casiers</CardTitle>
            <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,000</div>
            <p className="text-xs text-muted-foreground">Capacité totale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupés</CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">6,234</div>
            <p className="text-xs text-muted-foreground">89% d'occupation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libres</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">754</div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hors Service</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">4</div>
            <p className="text-xs text-muted-foreground">À réparer</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface de gestion */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des Casiers</TabsTrigger>
          <TabsTrigger value="map">Plan Interactif</TabsTrigger>
          <TabsTrigger value="bulk">Actions Groupées</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Casiers</CardTitle>
                  <CardDescription>Administration complète des casiers vestiaires</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Casier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter un Casier</DialogTitle>
                        <DialogDescription>Enregistrer un nouveau casier dans le système</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="numero">Numéro</Label>
                            <Input id="numero" placeholder="Ex: A-101" />
                          </div>
                          <div>
                            <Label htmlFor="zone">Zone</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Zone A">Zone A</SelectItem>
                                <SelectItem value="Zone B">Zone B</SelectItem>
                                <SelectItem value="Zone C">Zone C</SelectItem>
                                <SelectItem value="Zone D">Zone D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="etage">Étage</Label>
                            <Input id="etage" type="number" placeholder="1" />
                          </div>
                          <div>
                            <Label htmlFor="rangee">Rangée</Label>
                            <Input id="rangee" placeholder="A" />
                          </div>
                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" type="number" placeholder="1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="grand">Grand</SelectItem>
                                <SelectItem value="petit">Petit</SelectItem>
                                <SelectItem value="special">Spécial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="serrure">Type de Serrure</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronique">Électronique</SelectItem>
                                <SelectItem value="mecanique">Mécanique</SelectItem>
                                <SelectItem value="biometrique">Biométrique</SelectItem>
                                <SelectItem value="rfid">RFID</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button className="w-full">Ajouter le Casier</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtres */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par numéro, employé ou matricule..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les zones</SelectItem>
                    <SelectItem value="Zone A">Zone A</SelectItem>
                    <SelectItem value="Zone B">Zone B</SelectItem>
                    <SelectItem value="Zone C">Zone C</SelectItem>
                    <SelectItem value="Zone D">Zone D</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="libre">Libre</SelectItem>
                    <SelectItem value="occupe">Occupé</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="hors_service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tableau des casiers */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Zone/Étage</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Employé Assigné</TableHead>
                      <TableHead>Serrure</TableHead>
                      <TableHead>Dernier Accès</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLockers.map((locker) => (
                      <TableRow key={locker.id}>
                        <TableCell className="font-mono font-medium">{locker.numero}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {locker.zone} - É{locker.etage}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(locker.type)}</TableCell>
                        <TableCell>{getStatusBadge(locker.statut)}</TableCell>
                        <TableCell>
                          {locker.employe ? (
                            <div>
                              <div className="font-medium">
                                {locker.employe.prenom} {locker.employe.nom}
                              </div>
                              <div className="text-sm text-muted-foreground">{locker.employe.matricule}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Non assigné</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="capitalize text-sm">{locker.serrure.type}</span>
                            {locker.serrure.batterie && (
                              <Badge variant="outline" className="text-xs">
                                {locker.serrure.batterie}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {locker.dernierAcces ? new Date(locker.dernierAcces).toLocaleString("fr-FR") : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {locker.statut === "occupe" ? (
                                <Unlock className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Plan Interactif des Casiers</CardTitle>
              <CardDescription>Visualisation géographique et navigation par zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p>Plan interactif en développement</p>
                <p className="text-sm">Visualisation 3D des zones et localisation des casiers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Actions Groupées</CardTitle>
              <CardDescription>Opérations en masse sur plusieurs casiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4" />
                <p>Actions groupées en développement</p>
                <p className="text-sm">Attribution, libération et maintenance en masse</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
