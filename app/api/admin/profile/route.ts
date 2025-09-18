import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI =
  "mongodb+srv://admin:leoni2025@cluster0.73qpuyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("leoni_dashboard")
    const collection = db.collection("admin_profiles")

    const result = await collection.updateOne(
      { id: profileData.id },
      {
        $set: {
          ...profileData,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    await client.close()

    return NextResponse.json({
      success: true,
      message: "Profil sauvegardé avec succès dans MongoDB Atlas",
      result,
    })
  } catch (error) {
    console.error("Erreur sauvegarde profil:", error)
    return NextResponse.json({ error: "Erreur lors de la sauvegarde du profil" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("id")

    if (!profileId) {
      return NextResponse.json({ error: "ID profil requis" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("leoni_dashboard")
    const collection = db.collection("admin_profiles")

    const profile = await collection.findOne({ id: profileId })

    await client.close()

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Erreur récupération profil:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du profil" }, { status: 500 })
  }
}
