import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsAnalytics } from "@/components/reports-analytics"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rapports et Analytics</h1>
            <p className="text-muted-foreground">Analyses détaillées et rapports de performance des casiers Leoni</p>
          </div>
        </div>
        <ReportsAnalytics />
      </div>
    </DashboardLayout>
  )
}
