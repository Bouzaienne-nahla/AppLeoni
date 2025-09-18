import { DashboardLayout } from "@/components/dashboard-layout"
import { EmployeeManagement } from "@/components/employee-management"

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Employés</h1>
            <p className="text-muted-foreground">Attribution et gestion des casiers pour 7000+ employés Leoni</p>
          </div>
        </div>
        <EmployeeManagement />
      </div>
    </DashboardLayout>
  )
}
