import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, FileText, Settings } from "lucide-react"

const actions = [
  {
    title: "Nouveau Casier",
    description: "Ajouter un casier au système",
    icon: Plus,
    action: "add-locker",
  },
  {
    title: "Nouvel Utilisateur",
    description: "Enregistrer un employé",
    icon: UserPlus,
    action: "add-user",
  },
  {
    title: "Générer Rapport",
    description: "Créer un rapport d'occupation",
    icon: FileText,
    action: "generate-report",
  },
  {
    title: "Configuration",
    description: "Paramètres du système",
    icon: Settings,
    action: "settings",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Actions Rapides</CardTitle>
        <CardDescription className="text-muted-foreground">Raccourcis vers les fonctions principales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
