import { NextResponse } from "next/server"
import { getStatistiques } from "@/lib/data-service"

export async function GET() {
  try {
    const stats = getStatistiques()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
