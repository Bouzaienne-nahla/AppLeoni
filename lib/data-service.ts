import casiers1Data from "@/data/casiers1.json"
import casiers2Data from "@/data/casiers2.json"

export interface CasierData {
  numeroCasier: number
  employe?: string
  matricule?: number
  team?: string
  rh?: string
  subsy?: string
  zone: string
  refCle: string
  numeroCle: number
  dateLivre?: number
  commentaire?: string
  statut?: string
  telephone?: number
}

export function getAllCasiers(): CasierData[] {
  // Normaliser casiers1
  const casiers1: CasierData[] = casiers1Data.map((item: any) => ({
    numeroCasier: item["N° casier"] || item.H,
    employe: item["Personnel Number"],
    matricule: item.Mle,
    team: item.Team,
    rh: item.RH,
    subsy: item.Subsy,
    zone: item["Z Casier"],
    refCle: item["Réf° clé"],
    numeroCle: item["N°Clé"] || 0,
    dateLivre: item["Unnamed: 10"],
    commentaire: item["Unnamed: 12"] || item["Unnamed: 13"],
    statut: item["Personnel Number"] ? "occupé" : "libre",
  }))

  // Normaliser casiers2
  const casiers2: CasierData[] = casiers2Data.map((item: any) => ({
    numeroCasier: item["N°Casier"] || item["N°Casier.1"],
    employe: item["Personnel Number"],
    matricule: item["7"],
    team: item.Team,
    rh: item.RH,
    subsy: item.Subsy,
    zone: item["Z Casier"],
    refCle: item["Réf Clé"],
    numeroCle: item["N°Clé"] || 0,
    dateLivre: item["Date livré"],
    commentaire: item.Commentaire,
    telephone: item.Telf,
    statut: item.Commentaire === "QUITTE" ? "libre" : item["Personnel Number"] ? "occupé" : "libre",
  }))

  return [...casiers1, ...casiers2]
}

export function getStatistiques() {
  const allCasiers = getAllCasiers()
  const totalCasiers = allCasiers.length
  const casiersOccupes = allCasiers.filter((c) => c.employe && c.employe.trim() !== "" && c.statut !== "libre").length
  const casiersLibres = totalCasiers - casiersOccupes
  const employesActifs = new Set(
    allCasiers.filter((c) => c.employe && c.employe.trim() !== "" && c.matricule).map((c) => c.matricule),
  ).size
  const clesPerdues = allCasiers.filter(
    (c) =>
      c.numeroCle === 0 ||
      c.commentaire?.toLowerCase().includes("perdue") ||
      c.commentaire?.toLowerCase().includes("perte"),
  ).length

  return {
    totalCasiers,
    casiersOccupes,
    casiersLibres,
    employesActifs,
    clesPerdues,
  }
}

export function searchCasiers(query: string): CasierData[] {
  const allCasiers = getAllCasiers()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return []

  return allCasiers.filter(
    (casier) =>
      casier.numeroCasier.toString().includes(searchTerm) ||
      casier.employe?.toLowerCase().includes(searchTerm) ||
      casier.matricule?.toString().includes(searchTerm) ||
      casier.zone?.toLowerCase().includes(searchTerm) ||
      casier.refCle?.toLowerCase().includes(searchTerm) ||
      casier.team?.toLowerCase().includes(searchTerm) ||
      casier.rh?.toLowerCase().includes(searchTerm),
  )
}

export function getAllEmployees() {
  const allCasiers = getAllCasiers()
  const employees = allCasiers
    .filter((c) => c.employe && c.employe.trim() !== "" && c.matricule)
    .map((c) => ({
      nom: c.employe,
      matricule: c.matricule,
      team: c.team,
      rh: c.rh,
      subsy: c.subsy,
      casier: c.numeroCasier,
      zone: c.zone,
      telephone: c.telephone,
      statut: c.statut,
    }))

  // Remove duplicates based on matricule
  const uniqueEmployees = employees.filter(
    (emp, index, self) => index === self.findIndex((e) => e.matricule === emp.matricule),
  )

  return uniqueEmployees
}
