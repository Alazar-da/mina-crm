// app/customers/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Loader2,
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCustomers, deleteCustomer } from '@/actions/customerActions';
import { Customer } from '@/types';
import { AddCustomerForm } from '@/components/forms/AddCustomerForm';
import { useRouter } from 'next/navigation';

const statusStyles: Record<string, string> = {
  'active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'negotiation': 'bg-blue-50 text-blue-700 border-blue-200',
  'proposal_sent': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'inactive': 'bg-slate-50 text-slate-700 border-slate-200',
  'new_lead': 'bg-orange-50 text-orange-700 border-orange-200',
  'contacted': 'bg-purple-50 text-purple-700 border-purple-200',
  'interested': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'demo_scheduled': 'bg-pink-50 text-pink-700 border-pink-200',
  'won': 'bg-green-50 text-green-700 border-green-200',
  'lost': 'bg-red-50 text-red-700 border-red-200',
};

const healthStyles = {
  'excellent': 'bg-emerald-500',
  'good': 'bg-blue-500',
  'warning': 'bg-orange-500',
  'at_risk': 'bg-red-500',
};

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new_lead', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'demo_scheduled', label: 'Demo Scheduled' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'active', label: 'Active Customer' },
  { value: 'inactive', label: 'Inactive Customer' },
];

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = [...customers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomer(selectedCustomer.id);
        await fetchCustomers();
        setShowDeleteConfirm(false);
        setSelectedCustomer(null);
      } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 mt-1">Manage and track your customer relationships.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by company, contact, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-10 p-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-lg">No customers found</p>
              <p className="text-slate-500 text-sm mt-1">Try adding a new customer or adjusting your search.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Your First Customer
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Health</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                          {customer.company_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{customer.company_name}</p>
                          <p className="text-xs text-slate-500">Code: {customer.customer_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border capitalize inline-block",
                        statusStyles[customer.status] || statusStyles['inactive']
                      )}>
                        {formatStatus(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", healthStyles[customer.health_score as keyof typeof healthStyles] || 'bg-slate-400')}></div>
                        <span className="text-sm text-slate-600 capitalize">{customer.health_score?.replace('_', ' ') || 'Good'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{customer.industry || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">{customer.contact_person}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            const dropdown = document.getElementById(`dropdown-${customer.id}`);
                            if (dropdown) dropdown.classList.toggle('hidden');
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <div id={`dropdown-${customer.id}`} className="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10">
                          <button
                            onClick={() => router.push(`/customers/${customer.id}`)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-xl"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowDeleteConfirm(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-xl"
                          >
                            Delete Customer
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerForm 
          onClose={() => {
            setIsAddModalOpen(false);
            fetchCustomers();
          }} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Delete Customer</h2>
              <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="p-6">
              <p className="text-slate-700">
                Are you sure you want to delete <span className="font-bold">{selectedCustomer.company_name}</span>?
              </p>
              <p className="text-xs text-slate-500 mt-2">All associated data will be permanently removed.</p>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedCustomer(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}