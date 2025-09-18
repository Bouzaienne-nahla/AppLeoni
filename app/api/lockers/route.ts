import { NextResponse } from "next/server"

export async function GET() {
  try {
    const excelApiUrl = process.env.LEONI_EXCEL_API_URL || "http://localhost:3001/api/excel-data"

    try {
      const response = await fetch(excelApiUrl)
      if (response.ok) {
        const excelData = await response.json()

        // Transformation des données Excel en format casiers
        const lockers = excelData.map((row: any) => ({
          numero: row.numero_casier || row.numero,
          zone: row.zone || "Zone A",
          etage: row.etage || "RDC",
          statut: row.matricule_employe ? "occupé" : "libre",
          employe: row.matricule_employe ? `${row.nom_employe} ${row.prenom_employe || ""}`.trim() : null,
          dateAttribution: row.date_attribution || null,
          numeroCle: row.numero_cle || null,
        }))

        return NextResponse.json(lockers)
      }
    } catch (apiError) {
      console.log("[v0] API Excel casiers non disponible")
    }

    // Données par défaut
    return NextResponse.json([])
  } catch (error) {
    console.error("Erreur base de données casiers:", error)
    return NextResponse.json({ error: "Erreur de connexion à la base de données" }, { status: 500 })
  }
}
