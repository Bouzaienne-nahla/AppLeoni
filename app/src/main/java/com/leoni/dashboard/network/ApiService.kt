package com.leoni.dashboard.network

import retrofit2.Call
import retrofit2.http.*

interface ApiService {
    
    @GET("api/stats")
    fun getStats(): Call<StatsResponse>
    
    @GET("api/employees")
    fun getEmployees(): Call<List<Employee>>
    
    @POST("api/employees")
    fun addEmployee(@Body employee: Employee): Call<Employee>
    
    @PUT("api/employees/{id}")
    fun updateEmployee(@Path("id") id: String, @Body employee: Employee): Call<Employee>
    
    @DELETE("api/employees/{id}")
    fun deleteEmployee(@Path("id") id: String): Call<Void>
    
    @GET("api/casiers")
    fun getCasiers(): Call<List<Casier>>
    
    @PUT("api/casiers/{id}")
    fun updateCasier(@Path("id") id: String, @Body casier: Casier): Call<Casier>
    
    @POST("api/admin/login")
    fun login(@Body credentials: LoginRequest): Call<LoginResponse>
}

data class StatsResponse(
    val totalCasiers: Int,
    val casiersOccupes: Int,
    val casiersLibres: Int,
    val clesPerdues: Int,
    val tauxOccupation: Double
)

data class Employee(
    val id: String,
    val matricule: String,
    val nom: String,
    val prenom: String,
    val departement: String,
    val poste: String,
    val casierNumero: String?,
    val cleNumero: String?,
    val dateAttribution: String?
)

data class Casier(
    val numero: String,
    val zone: String,
    val statut: String, // "libre", "occupe", "maintenance", "hors_service"
    val cleNumero: String,
    val employeMatricule: String?,
    val employeNom: String?,
    val dateAttribution: String?,
    val observations: String?
)

data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val success: Boolean,
    val token: String?,
    val adminName: String?,
    val message: String?
)
