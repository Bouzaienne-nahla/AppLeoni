"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Calendar, Shield, Bell, Lock, Save, CheckCircle, AlertTriangle } from "lucide-react"

interface AdminProfile {
  id: string
  username: string
  email: string
  phone: string
  firstName: string
  lastName: string
  position: string
  department: string
  location: string
  joinDate: string
  lastLogin: string
  permissions: string[]
  preferences: {
    language: string
    timezone: string
    emailNotifications: boolean
    smsNotifications: boolean
    theme: string
  }
}

export default function ProfileSettingsPage() {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    // Charger le profil admin depuis localStorage ou API
    const user = localStorage.getItem("admin_user")
    if (user) {
      const userData = JSON.parse(user)
      setAdminProfile({
        id: userData.id || "admin-001",
        username: userData.username,
        email: userData.email || "admin@leoni.com",
        phone: userData.phone || "+33 1 23 45 67 89",
        firstName: userData.firstName || "Admin",
        lastName: userData.lastName || "Leoni",
        position: "Administrateur Système",
        department: "IT & Sécurité",
        location: "Tunis, Tunisie",
        joinDate: "2023-01-15",
        lastLogin: new Date().toISOString(),
        permissions: ["admin", "security", "reports", "users"],
        preferences: {
          language: "fr-FR",
          timezone: "Europe/Paris",
          emailNotifications: true,
          smsNotifications: false,
          theme: "light",
        },
      })
    }
  }, [])

  const handleSaveProfile = async () => {
    if (!adminProfile) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminProfile),
      })

      if (response.ok) {
        // Mettre à jour localStorage
        localStorage.setItem(
          "admin_user",
          JSON.stringify({
            id: adminProfile.id,
            username: adminProfile.username,
            email: adminProfile.email,
          }),
        )

        setSaveMessage("Profil sauvegardé avec succès!")
        setIsEditing(false)

        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error)
      setSaveMessage("Erreur de connexion")
    } finally {
      setIsSaving(false)
    }
  }

  const updateProfile = (field: string, value: any) => {
    if (!adminProfile) return

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setAdminProfile({
        ...adminProfile,
        [parent]: {
          ...adminProfile[parent as keyof AdminProfile],
          [child]: value,
        },
      })
    } else {
      setAdminProfile({
        ...adminProfile,
        [field]: value,
      })
    }
  }

  if (!adminProfile) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil & Paramètres</h1>
            <p className="text-gray-500">Gérez votre profil administrateur et les paramètres système</p>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && (
              <Alert
                className={`w-auto ${saveMessage.includes("succès") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <AlertDescription className={saveMessage.includes("succès") ? "text-green-800" : "text-red-800"}>
                  {saveMessage.includes("succès") ? (
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                  )}
                  {saveMessage}
                </AlertDescription>
              </Alert>
            )}
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Modifier le Profil</Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte profil */}
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {adminProfile.firstName.charAt(0)}
                      {adminProfile.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>
                    {adminProfile.firstName} {adminProfile.lastName}
                  </CardTitle>
                  <CardDescription>{adminProfile.position}</CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrateur
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{adminProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{adminProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{adminProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Depuis {new Date(adminProfile.joinDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Informations détaillées */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Vos informations de base</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={adminProfile.firstName}
                          onChange={(e) => updateProfile("firstName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={adminProfile.lastName}
                          onChange={(e) => updateProfile("lastName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={adminProfile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={adminProfile.phone}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Département</Label>
                        <Input
                          id="department"
                          value={adminProfile.department}
                          onChange={(e) => updateProfile("department", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Localisation</Label>
                        <Input
                          id="location"
                          value={adminProfile.location}
                          onChange={(e) => updateProfile("location", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>Personnalisez votre expérience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Langue</Label>
                        <Select
                          value={adminProfile.preferences.language}
                          onValueChange={(value) => updateProfile("preferences.language", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr-FR">Français</SelectItem>
                            <SelectItem value="en-US">English</SelectItem>
                            <SelectItem value="ar-TN">العربية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timezone">Fuseau Horaire</Label>
                        <Select
                          value={adminProfile.preferences.timezone}
                          onValueChange={(value) => updateProfile("preferences.timezone", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                            <SelectItem value="Africa/Tunis">Africa/Tunis</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Sécurité</CardTitle>
                <CardDescription>Gérez la sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Mot de Passe</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" disabled={!isEditing} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {adminProfile.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de Notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications Email</Label>
                    <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={adminProfile.preferences.emailNotifications}
                    onCheckedChange={(checked) => updateProfile("preferences.emailNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notifications SMS</Label>
                    <p className="text-sm text-gray-500">Recevoir les alertes critiques par SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={adminProfile.preferences.smsNotifications}
                    onCheckedChange={(checked) => updateProfile("preferences.smsNotifications", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Système</CardTitle>
                <CardDescription>Configuration générale du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Informations Système</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Version:</span>
                        <span className="font-medium">v2.1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base de données:</span>
                        <span className="font-medium">MongoDB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dernière connexion:</span>
                        <span className="font-medium">{new Date(adminProfile.lastLogin).toLocaleString("fr-FR")}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Actions Système</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Lock className="mr-2 h-4 w-4" />
                        Changer le mot de passe
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Bell className="mr-2 h-4 w-4" />
                        Tester les notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Save className="mr-2 h-4 w-4" />
                        Exporter les paramètres
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
