import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Structure Excel attendue : numero_casier, numero_cle, matricule_employe, nom_employe, statut

    // Simulation des données - À REMPLACER par votre vraie lecture Excel
    const mockCasiers = [
      {
        numero: 1001,
        numeroClé: "CLE-1001",
        statut: "occupé",
        employé: { matricule: "LEO001", nom: "Dupont", prenom: "Jean" },
      },
      {
        numero: 1002,
        numeroClé: "CLE-1002",
        statut: "libre",
      },
      // ... autres casiers de votre Excel
    ]

    return NextResponse.json(mockCasiers)
  } catch (error) {
    console.error("Erreur lors de la récupération des casiers:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
