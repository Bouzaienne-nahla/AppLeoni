package com.leoni.dashboard

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.leoni.dashboard.adapters.StatsAdapter
import com.leoni.dashboard.adapters.ActivityAdapter
import com.leoni.dashboard.databinding.ActivityMainBinding
import com.leoni.dashboard.models.StatsCard
import com.leoni.dashboard.models.ActivityItem
import com.leoni.dashboard.network.ApiService
import com.leoni.dashboard.network.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var statsAdapter: StatsAdapter
    private lateinit var activityAdapter: ActivityAdapter
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var apiService: ApiService
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Vérifier l'authentification
        sharedPreferences = getSharedPreferences("leoni_prefs", MODE_PRIVATE)
        if (!isLoggedIn()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }
        
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = "Dashboard Admin - Leoni"
        
        apiService = RetrofitClient.getInstance().create(ApiService::class.java)
        
        setupRecyclerViews()
        setupClickListeners()
        loadDashboardData()
        
        // Actualisation automatique toutes les 5 minutes
        binding.swipeRefresh.setOnRefreshListener {
            loadDashboardData()
        }
    }
    
    private fun isLoggedIn(): Boolean {
        return sharedPreferences.getBoolean("is_logged_in", false)
    }
    
    private fun setupRecyclerViews() {
        // Configuration des statistiques en grille 2x2 pour tablette
        statsAdapter = StatsAdapter(emptyList())
        binding.recyclerStats.apply {
            layoutManager = GridLayoutManager(this@MainActivity, 2)
            adapter = statsAdapter
        }
        
        // Configuration des activités récentes
        activityAdapter = ActivityAdapter(emptyList())
        binding.recyclerActivity.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = activityAdapter
        }
    }
    
    private fun setupClickListeners() {
        binding.cardEmployees.setOnClickListener {
            startActivity(Intent(this, EmployeeCasiersActivity::class.java))
        }
        
        binding.cardReports.setOnClickListener {
            startActivity(Intent(this, ReportsActivity::class.java))
        }
        
        binding.cardSecurity.setOnClickListener {
            startActivity(Intent(this, SecurityActivity::class.java))
        }
        
        binding.cardSettings.setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
    }
    
    private fun loadDashboardData() {
        binding.swipeRefresh.isRefreshing = true
        
        // Charger les statistiques depuis l'API Excel de Leoni
        apiService.getStats().enqueue(object : Callback<StatsResponse> {
            override fun onResponse(call: Call<StatsResponse>, response: Response<StatsResponse>) {
                binding.swipeRefresh.isRefreshing = false
                if (response.isSuccessful) {
                    response.body()?.let { stats ->
                        updateStats(stats)
                        updateLastSync()
                    }
                } else {
                    showError("Erreur de chargement des statistiques")
                }
            }
            
            override fun onFailure(call: Call<StatsResponse>, t: Throwable) {
                binding.swipeRefresh.isRefreshing = false
                showError("Erreur de connexion: ${t.message}")
                loadDefaultStats() // Données par défaut en cas d'erreur
            }
        })
        
        loadRecentActivity()
    }
    
    private fun updateStats(stats: StatsResponse) {
        val statsList = listOf(
            StatsCard("Casiers Totaux", stats.totalCasiers.toString(), "📦", "#2563eb"),
            StatsCard("Casiers Occupés", stats.casiersOccupes.toString(), "🔒", "#059669"),
            StatsCard("Casiers Libres", stats.casiersLibres.toString(), "🔓", "#dc2626"),
            StatsCard("Clés Perdues", stats.clesPerdues.toString(), "🔑", "#ea580c")
        )
        statsAdapter.updateStats(statsList)
        
        // Mettre à jour les pourcentages
        val occupationRate = (stats.casiersOccupes * 100) / stats.totalCasiers
        binding.textOccupationRate.text = "Taux d'occupation: ${occupationRate}%"
    }
    
    private fun loadDefaultStats() {
        val defaultStats = listOf(
            StatsCard("Casiers Totaux", "7000", "📦", "#2563eb"),
            StatsCard("Casiers Occupés", "6234", "🔒", "#059669"),
            StatsCard("Casiers Libres", "766", "🔓", "#dc2626"),
            StatsCard("Clés Perdues", "12", "🔑", "#ea580c")
        )
        statsAdapter.updateStats(defaultStats)
        binding.textOccupationRate.text = "Taux d'occupation: 89%"
    }
    
    private fun loadRecentActivity() {
        val activities = listOf(
            ActivityItem("Attribution casier #1234", "Employé: Martin Dubois", "Il y a 5 min"),
            ActivityItem("Libération casier #5678", "Employé: Sophie Laurent", "Il y a 12 min"),
            ActivityItem("Clé perdue signalée", "Casier #9012 - Jean Moreau", "Il y a 25 min"),
            ActivityItem("Maintenance terminée", "Zone A - Casiers 100-150", "Il y a 1h"),
            ActivityItem("Nouveau employé", "Pierre Durand - Casier #3456", "Il y a 2h")
        )
        activityAdapter.updateActivities(activities)
    }
    
    private fun updateLastSync() {
        val currentTime = java.text.SimpleDateFormat("HH:mm", java.util.Locale.FRANCE)
            .format(java.util.Date())
        binding.textLastSync.text = "Dernière sync: $currentTime"
    }
    
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
                logout()
                true
            }
            R.id.action_refresh -> {
                loadDashboardData()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    private fun logout() {
        sharedPreferences.edit()
            .putBoolean("is_logged_in", false)
            .remove("admin_name")
            .apply()
        
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
