"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InnovativeAssignmentManagement } from "@/components/innovative-assignment-management"

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assignements des Casiers</h1>
            <p className="text-muted-foreground">Système innovant de scannage et d'assignement avec IA</p>
          </div>
        </div>
        <InnovativeAssignmentManagement />
      </div>
    </DashboardLayout>
  )
}
