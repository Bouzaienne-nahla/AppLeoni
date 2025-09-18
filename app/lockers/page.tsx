import { DashboardLayout } from "@/components/dashboard-layout"
import { LockerManagement } from "@/components/locker-management"

export default function LockersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Casiers</h1>
            <p className="text-muted-foreground">Administration complète des 7000+ casiers vestiaires Leoni</p>
          </div>
        </div>
        <LockerManagement />
      </div>
    </DashboardLayout>
  )
}
