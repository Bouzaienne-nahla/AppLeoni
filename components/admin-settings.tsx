"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  Users,
  Archive,
  BarChart3,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface SystemConfig {
  general: {
    companyName: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
  }
  lockers: {
    totalCapacity: number
    autoAssignment: boolean
    maintenanceMode: boolean
    defaultLockType: string
    keyTimeout: number
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordPolicy: string
    twoFactorAuth: boolean
    auditLogging: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    maintenanceAlerts: boolean
    securityAlerts: boolean
    reportSchedule: string
  }
  synchronization: {
    dataSource: string
    syncFrequency: string
    lastSync: string
    autoSync: boolean
  }
}

const defaultConfig: SystemConfig = {
  general: {
    companyName: "Leoni AG",
    timezone: "Europe/Paris",
    language: "fr-FR",
    dateFormat: "DD/MM/YYYY",
    currency: "EUR",
  },
  lockers: {
    totalCapacity: 7000,
    autoAssignment: true,
    maintenanceMode: false,
    defaultLockType: "physical_key",
    keyTimeout: 480, // 8 heures pour retour de clé
  },
  security: {
    sessionTimeout: 480,
    maxLoginAttempts: 3,
    passwordPolicy: "strong",
    twoFactorAuth: true,
    auditLogging: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    maintenanceAlerts: true,
    securityAlerts: true,
    reportSchedule: "weekly",
  },
  synchronization: {
    dataSource: "excel_database",
    syncFrequency: "daily",
    lastSync: "2024-01-15 06:00:00",
    autoSync: true,
  },
}

export function AdminSettings() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem("admin_user")
    if (user) {
      setAdminUser(JSON.parse(user))
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setHasChanges(false)
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleConfigChange = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuration Système</CardTitle>
              <CardDescription>Paramètres généraux et configuration avancée</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Modifications non sauvegardées
                </Badge>
              )}
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter Config
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer Config
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || saving}>
                {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* État du système */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État Système</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Opérationnel</div>
            <p className="text-xs text-muted-foreground">Tous services actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Données</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Disponibilité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Connectés maintenant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Sauvegarde</CardTitle>
            <Archive className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">Il y a</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration détaillée */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="lockers">Casiers</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sync">Synchronisation</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configuration de base de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Nom de l'Entreprise</Label>
                    <Input
                      id="company-name"
                      value={config.general.companyName}
                      onChange={(e) => handleConfigChange("general", "companyName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuseau Horaire</Label>
                    <Select
                      value={config.general.timezone}
                      onValueChange={(value) => handleConfigChange("general", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select
                      value={config.general.language}
                      onValueChange={(value) => handleConfigChange("general", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr-FR">Français</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="de-DE">Deutsch</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date-format">Format de Date</Label>
                    <Select
                      value={config.general.dateFormat}
                      onValueChange={(value) => handleConfigChange("general", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Select
                      value={config.general.currency}
                      onValueChange={(value) => handleConfigChange("general", "currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar US ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lockers">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Casiers</CardTitle>
              <CardDescription>Paramètres de gestion des casiers vestiaires avec clés physiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="total-capacity">Capacité Totale</Label>
                    <Input
                      id="total-capacity"
                      type="number"
                      value={config.lockers.totalCapacity}
                      onChange={(e) => handleConfigChange("lockers", "totalCapacity", Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nombre total de casiers disponibles (actuellement 7000)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="default-lock">Type de Serrure</Label>
                    <Select
                      value={config.lockers.defaultLockType}
                      onValueChange={(value) => handleConfigChange("lockers", "defaultLockType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical_key">Clé Physique</SelectItem>
                        <SelectItem value="combination">Cadenas à Combinaison</SelectItem>
                        <SelectItem value="master_key">Clé Maître</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="key-timeout">Délai Retour Clé (heures)</Label>
                    <Input
                      id="key-timeout"
                      type="number"
                      value={config.lockers.keyTimeout}
                      onChange={(e) => handleConfigChange("lockers", "keyTimeout", Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Temps maximum avant alerte de non-retour</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Attribution Automatique</Label>
                      <p className="text-sm text-muted-foreground">Assigner automatiquement les casiers libres</p>
                    </div>
                    <Switch
                      checked={config.lockers.autoAssignment}
                      onCheckedChange={(checked) => handleConfigChange("lockers", "autoAssignment", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode Maintenance</Label>
                      <p className="text-sm text-muted-foreground">Désactiver l'accès pour maintenance générale</p>
                    </div>
                    <Switch
                      checked={config.lockers.maintenanceMode}
                      onCheckedChange={(checked) => handleConfigChange("lockers", "maintenanceMode", checked)}
                    />
                  </div>
                </div>
              </div>
              {config.lockers.maintenanceMode && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Le mode maintenance est activé. Les utilisateurs ne peuvent pas accéder aux casiers.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>Configuration de la sécurité et des accès</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-timeout">Délai de Session (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) =>
                        handleConfigChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-attempts">Tentatives de Connexion Max</Label>
                    <Input
                      id="max-attempts"
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) =>
                        handleConfigChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="password-policy">Politique de Mot de Passe</Label>
                    <Select
                      value={config.security.passwordPolicy}
                      onValueChange={(value) => handleConfigChange("security", "passwordPolicy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique (6 caractères min)</SelectItem>
                        <SelectItem value="medium">Moyen (8 caractères, majuscules)</SelectItem>
                        <SelectItem value="strong">Fort (12 caractères, complexe)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à Deux Facteurs</Label>
                      <p className="text-sm text-muted-foreground">Exiger une vérification supplémentaire</p>
                    </div>
                    <Switch
                      checked={config.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleConfigChange("security", "twoFactorAuth", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Journalisation d'Audit</Label>
                      <p className="text-sm text-muted-foreground">Enregistrer toutes les actions système</p>
                    </div>
                    <Switch
                      checked={config.security.auditLogging}
                      onCheckedChange={(checked) => handleConfigChange("security", "auditLogging", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configuration des alertes et notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications Email</Label>
                      <p className="text-sm text-muted-foreground">Envoyer les alertes par email</p>
                    </div>
                    <Switch
                      checked={config.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleConfigChange("notifications", "emailNotifications", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications SMS</Label>
                      <p className="text-sm text-muted-foreground">Envoyer les alertes critiques par SMS</p>
                    </div>
                    <Switch
                      checked={config.notifications.smsNotifications}
                      onCheckedChange={(checked) => handleConfigChange("notifications", "smsNotifications", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes Maintenance</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les interventions</p>
                    </div>
                    <Switch
                      checked={config.notifications.maintenanceAlerts}
                      onCheckedChange={(checked) => handleConfigChange("notifications", "maintenanceAlerts", checked)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes Sécurité</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les incidents</p>
                    </div>
                    <Switch
                      checked={config.notifications.securityAlerts}
                      onCheckedChange={(checked) => handleConfigChange("notifications", "securityAlerts", checked)}
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="report-schedule">Fréquence des Rapports</Label>
                    <Select
                      value={config.notifications.reportSchedule}
                      onValueChange={(value) => handleConfigChange("notifications", "reportSchedule", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation des Données</CardTitle>
              <CardDescription>Configuration de la synchronisation avec la base Excel Leoni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="data-source">Source de Données</Label>
                    <Select
                      value={config.synchronization.dataSource}
                      onValueChange={(value) => handleConfigChange("synchronization", "dataSource", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel_database">Base Excel Leoni</SelectItem>
                        <SelectItem value="sql_server">SQL Server</SelectItem>
                        <SelectItem value="oracle_db">Oracle Database</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sync-frequency">Fréquence de Synchronisation</Label>
                    <Select
                      value={config.synchronization.syncFrequency}
                      onValueChange={(value) => handleConfigChange("synchronization", "syncFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne (6h00)</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="manual">Manuelle uniquement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Synchronisation Automatique</Label>
                      <p className="text-sm text-muted-foreground">Synchroniser automatiquement selon la fréquence</p>
                    </div>
                    <Switch
                      checked={config.synchronization.autoSync}
                      onCheckedChange={(checked) => handleConfigChange("synchronization", "autoSync", checked)}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Dernière Synchronisation</div>
                    <div className="text-lg font-bold">{config.synchronization.lastSync}</div>
                  </div>
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Synchroniser Maintenant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Administration Système</CardTitle>
              <CardDescription>Outils d'administration et maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sauvegarde et Restauration</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Créer une Sauvegarde Complète
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurer depuis Sauvegarde
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="h-4 w-4 mr-2" />
                      Optimiser la Base de Données
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Maintenance Système</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Redémarrer les Services
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Archive className="h-4 w-4 mr-2" />
                      Nettoyer les Logs Anciens
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Générer Rapport Système
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informations Système</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Version</div>
                    <div className="text-lg font-bold">v2.1.0</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Base de Données</div>
                    <div className="text-lg font-bold">PostgreSQL 15</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Serveur</div>
                    <div className="text-lg font-bold">Ubuntu 22.04</div>
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
