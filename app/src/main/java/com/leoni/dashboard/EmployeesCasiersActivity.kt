package com.leoni.dashboard

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.tabs.TabLayout
import com.google.android.material.textfield.TextInputEditText
import com.leoni.dashboard.adapters.EmployeeAdapter
import com.leoni.dashboard.adapters.CasierAdapter
import com.leoni.dashboard.models.Employee
import com.leoni.dashboard.models.Casier
import com.leoni.dashboard.network.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EmployeesCasiersActivity : AppCompatActivity() {
    
    private lateinit var tabLayout: TabLayout
    private lateinit var recyclerView: RecyclerView
    private lateinit var searchInput: TextInputEditText
    
    private lateinit var employeeAdapter: EmployeeAdapter
    private lateinit var casierAdapter: CasierAdapter
    
    private var employees = mutableListOf<Employee>()
    private var casiers = mutableListOf<Casier>()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_employees_casiers)
        
        initViews()
        setupTabs()
        loadData()
    }
    
    private fun initViews() {
        tabLayout = findViewById(R.id.tabLayout)
        recyclerView = findViewById(R.id.recyclerView)
        searchInput = findViewById(R.id.searchInput)
        
        recyclerView.layoutManager = LinearLayoutManager(this)
        
        employeeAdapter = EmployeeAdapter(employees)
        casierAdapter = CasierAdapter(casiers)
    }
    
    private fun setupTabs() {
        tabLayout.addTab(tabLayout.newTab().setText("Employés"))
        tabLayout.addTab(tabLayout.newTab().setText("Casiers"))
        
        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab?.position) {
                    0 -> {
                        recyclerView.adapter = employeeAdapter
                    }
                    1 -> {
                        recyclerView.adapter = casierAdapter
                    }
                }
            }
            
            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })
        
        // Sélectionner le premier onglet par défaut
        recyclerView.adapter = employeeAdapter
    }
    
    private fun loadData() {
        // Charger les employés
        ApiService.instance.getEmployees().enqueue(object : Callback<List<Employee>> {
            override fun onResponse(call: Call<List<Employee>>, response: Response<List<Employee>>) {
                if (response.isSuccessful) {
                    employees.clear()
                    employees.addAll(response.body() ?: emptyList())
                    employeeAdapter.notifyDataSetChanged()
                }
            }
            
            override fun onFailure(call: Call<List<Employee>>, t: Throwable) {
                Toast.makeText(this@EmployeesCasiersActivity, "Erreur de chargement des employés", Toast.LENGTH_SHORT).show()
            }
        })
        
        // Charger les casiers
        ApiService.instance.getCasiers().enqueue(object : Callback<List<Casier>> {
            override fun onResponse(call: Call<List<Casier>>, response: Response<List<Casier>>) {
                if (response.isSuccessful) {
                    casiers.clear()
                    casiers.addAll(response.body() ?: emptyList())
                    casierAdapter.notifyDataSetChanged()
                }
            }
            
            override fun onFailure(call: Call<List<Casier>>, t: Throwable) {
                Toast.makeText(this@EmployeesCasiersActivity, "Erreur de chargement des casiers", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
