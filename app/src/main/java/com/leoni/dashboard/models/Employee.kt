package com.leoni.dashboard.models

data class Employee(
    val matricule: String,
    val nom: String,
    val prenom: String,
    val departement: String,
    val numeroCasier: Int? = null,
    val numeroClé: String? = null,
    val dateAttribution: String? = null
)

data class Casier(
    val numero: Int,
    val numeroClé: String,
    val statut: String, // "libre", "occupé", "maintenance"
    val employé: EmployeeInfo? = null
)

data class EmployeeInfo(
    val matricule: String,
    val nom: String,
    val prenom: String
)

data class LockerStats(
    val totalCasiers: Int,
    val casiersOccupes: Int,
    val casiersLibres: Int,
    val employesActifs: Int,
    val clesPerdues: Int
)
