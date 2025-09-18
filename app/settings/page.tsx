import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminSettings } from "@/components/admin-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration Système</h1>
            <p className="text-muted-foreground">Configuration générale et paramètres avancés du système Leoni</p>
          </div>
        </div>
        <AdminSettings />
      </div>
    </DashboardLayout>
  )
}
