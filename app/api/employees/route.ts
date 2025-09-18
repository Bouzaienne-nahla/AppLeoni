import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Connexion à l'API Excel de Leoni
    const excelApiUrl = process.env.LEONI_EXCEL_API_URL || "https://appleoni.onrender.com/api/excel-data"

    try {
      const response = await fetch(excelApiUrl)
      if (response.ok) {
        const excelData = await response.json()

        // Transformation des données Excel en format employés
        const employees = excelData
          .filter((row: any) => row.matricule_employe && row.nom_employe)
          .map((row: any, index: number) => ({
            id: index + 1,
            matricule: row.matricule_employe,
            nom: row.nom_employe,
            prenom: row.prenom_employe || "",
            departement: row.departement || "Production",
            poste: row.poste || "Opérateur",
            equipe: row.equipe || "Équipe A",
            dateEmbauche: row.date_embauche || new Date().toISOString().split("T")[0],
            casierAttribue: row.numero_casier || null,
            statut: row.statut || "actif",
          }))

        return NextResponse.json(employees)
      }
    } catch (apiError) {
      console.log("[v0] API Excel non disponible, utilisation de données par défaut")
    }

    // Données par défaut si Excel non disponible
    return NextResponse.json([])
  } catch (error) {
    console.error("Erreur base de données:", error)
    return NextResponse.json({ error: "Erreur de connexion à la base de données" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("[v0] Nouvel employé à ajouter:", data)

    // Ici vous devrez implémenter l'ajout dans votre fichier Excel
    // Pour l'instant, on retourne les données avec un ID généré
    const newEmployee = {
      id: Date.now(), // ID temporaire
      ...data,
      dateEmbauche: data.dateEmbauche || new Date().toISOString().split("T")[0],
      statut: "actif",
    }

    return NextResponse.json(newEmployee)
  } catch (error) {
    console.error("Erreur insertion:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout de l'employé" }, { status: 500 })
  }
}
