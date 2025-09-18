"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { SuccessDialog } from "@/components/auth/success-dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { LockerChart } from "@/components/locker-chart"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { authService, type User } from "@/lib/auth"

type AuthView = "login" | "register"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [authView, setAuthView] = useState<AuthView>("login")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
  }, [])

  const handleLoginSuccess = () => {
    authService.getCurrentUser().then(setUser)
  }

  const handleRegisterSuccess = () => {
    setShowSuccessDialog(true)
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    setAuthView("login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show authentication forms if user is not logged in
  if (!user) {
    return (
      <>
        {authView === "login" ? (
          <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthView("register")} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setAuthView("login")} />
        )}
        <SuccessDialog open={showSuccessDialog} onClose={handleSuccessDialogClose} />
      </>
    )
  }

  // Show dashboard if user is logged in
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg text-white">
                Dashboard Admin - Gestion des Casiers Leoni
              </h1>
              <p className="drop-shadow-sm text-white/90">
                Système de gestion industrielle pour 7000+ casiers vestiaires
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg px-4 py-2 mb-2">
                <span className="text-sm font-medium text-white">Système: Opérationnel</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-white">
                  Dernière sync: {new Date().toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <LockerChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        <QuickActions />
      </div>
    </DashboardLayout>
  )
}
