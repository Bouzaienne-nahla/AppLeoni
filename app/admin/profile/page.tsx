"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield, Calendar } from "lucide-react"

export default function AdminProfile() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("admin_user")
    if (user) {
      setAdminUser(JSON.parse(user))
    }
  }, [])

  if (!adminUser) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profil Administrateur</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" value={adminUser.username} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={adminUser.email || "admin@leoni.com"} disabled={!isEditing} />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" value="Administrateur Système" disabled />
            </div>
            {isEditing && <Button className="w-full">Sauvegarder les modifications</Button>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Dernière connexion</span>
              </div>
              <p className="text-gray-900">Aujourd'hui à 09:30</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
