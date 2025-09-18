package com.leoni.dashboard.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.leoni.dashboard.R
import com.leoni.dashboard.models.Employee

class EmployeeAdapter(private val employees: List<Employee>) : RecyclerView.Adapter<EmployeeAdapter.EmployeeViewHolder>() {

    class EmployeeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvName: TextView = itemView.findViewById(R.id.tvEmployeeName)
        val tvMatricule: TextView = itemView.findViewById(R.id.tvEmployeeMatricule)
        val tvDepartment: TextView = itemView.findViewById(R.id.tvEmployeeDepartment)
        val tvLocker: TextView = itemView.findViewById(R.id.tvEmployeeLocker)
        val tvKey: TextView = itemView.findViewById(R.id.tvEmployeeKey)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmployeeViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_employee, parent, false)
        return EmployeeViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmployeeViewHolder, position: Int) {
        val employee = employees[position]
        
        holder.tvName.text = "${employee.prenom} ${employee.nom}"
        holder.tvMatricule.text = "Matricule: ${employee.matricule}"
        holder.tvDepartment.text = "Département: ${employee.departement}"
        
        if (employee.numeroCasier != null) {
            holder.tvLocker.text = "Casier #${employee.numeroCasier}"
            holder.tvKey.text = "Clé: ${employee.numeroClé}"
            holder.tvLocker.visibility = View.VISIBLE
            holder.tvKey.visibility = View.VISIBLE
        } else {
            holder.tvLocker.text = "Sans casier"
            holder.tvKey.visibility = View.GONE
            holder.tvLocker.visibility = View.VISIBLE
        }
    }

    override fun getItemCount() = employees.size
}
