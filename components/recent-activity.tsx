import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Marie Dubois",
    action: "Attribution casier #A-127",
    time: "Il y a 5 min",
    type: "assignment",
  },
  {
    id: 2,
    user: "Jean Martin",
    action: "Libération casier #B-045",
    time: "Il y a 12 min",
    type: "release",
  },
  {
    id: 3,
    user: "Sophie Laurent",
    action: "Maintenance casier #C-089",
    time: "Il y a 1h",
    type: "maintenance",
  },
  {
    id: 4,
    user: "Pierre Durand",
    action: "Attribution casier #A-156",
    time: "Il y a 2h",
    type: "assignment",
  },
  {
    id: 5,
    user: "Admin System",
    action: "Nettoyage automatique",
    time: "Il y a 3h",
    type: "system",
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case "assignment":
      return "bg-chart-1/10 text-chart-1"
    case "release":
      return "bg-chart-2/10 text-chart-2"
    case "maintenance":
      return "bg-chart-5/10 text-chart-5"
    case "system":
      return "bg-chart-3/10 text-chart-3"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Activité Récente</CardTitle>
        <CardDescription className="text-muted-foreground">Dernières actions sur les casiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="secondary" className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
