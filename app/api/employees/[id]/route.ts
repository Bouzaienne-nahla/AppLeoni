import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Suppression employé ID:", params.id)

    // Ici vous devrez implémenter la suppression dans votre fichier Excel
    // Pour l'instant, on simule le succès
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
