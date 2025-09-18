import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    console.log("Configuration sauvegardée:", config)

    // Ici vous devriez sauvegarder dans votre base de données réelle
    // await saveConfigToDatabase(config)

    return NextResponse.json({
      success: true,
      message: "Configuration sauvegardée avec succès",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur lors de la sauvegarde" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const config = {
      // Configuration par défaut - remplacer par données réelles
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur lors de la récupération" }, { status: 500 })
  }
}
