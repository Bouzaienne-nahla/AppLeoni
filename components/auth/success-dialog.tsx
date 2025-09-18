"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SuccessDialogProps {
  open: boolean
  onClose: () => void
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (open && countdown === 0) {
      onClose()
    }
  }, [open, countdown, onClose])

  useEffect(() => {
    if (open) {
      setCountdown(3)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <DialogTitle className="text-xl font-bold text-secondary">Compte créé avec succès !</DialogTitle>
          <DialogDescription className="text-center">
            Votre compte administrateur a été créé. Vous allez être redirigé vers la page de connexion dans {countdown}{" "}
            secondes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} variant="outline">
            Continuer maintenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
