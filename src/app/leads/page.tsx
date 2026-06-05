// app/leads/page.tsx (Updated with edit functionality)
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  DollarSign, 
  Loader2,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  User,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getLeads, updateLeadStage, deleteLead } from '@/actions/leadActions';
import { Lead } from '@/types';
import { AddLeadForm } from '@/components/forms/AddLeadForm';
import { EditLeadForm } from '@/components/forms/EditLeadForm';

const stages = [
  { id: 'new_lead', title: 'New Leads', color: 'bg-blue-500', darkColor: 'bg-blue-600' },
  { id: 'contacted', title: 'Contacted', color: 'bg-indigo-500', darkColor: 'bg-indigo-600' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500', darkColor: 'bg-purple-600' },
  { id: 'proposal', title: 'Proposal', color: 'bg-violet-500', darkColor: 'bg-violet-600' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500', darkColor: 'bg-orange-600' },
  { id: 'won', title: 'Won', color: 'bg-emerald-500', darkColor: 'bg-emerald-600' },
  { id: 'lost', title: 'Lost', color: 'bg-red-500', darkColor: 'bg-red-600' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status: stageId } : l);
    setLeads(updatedLeads);

    try {
      await updateLeadStage(leadId, stageId);
      await fetchLeads();
    } catch (error) {
      console.error('Failed to update lead stage:', error);
      fetchLeads();
    }
  };

  const onDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        await deleteLead(selectedLead.id);
        await fetchLeads();
        setShowDeleteConfirm(false);
        setSelectedLead(null);
        setShowLeadDetails(false);
      } catch (error) {
        console.error('Failed to delete lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
    setShowLeadDetails(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStageColor = (stageId: string, isDark: boolean = false) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return 'bg-slate-500';
    return isDark ? stage.darkColor : stage.color;
  };

  const getStageTitle = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage?.title || stageId;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your sales opportunities.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          New Lead
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[600px]">
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className="w-80 shrink-0 flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", stage.color)}></div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">{stage.title}</h3>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                  {leads.filter(l => l.status === stage.id).length}
                </span>
              </div>
            </div>

            <div className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-3 space-y-4 border border-dashed border-slate-200 dark:border-slate-700">
              {loading && leads.length === 0 ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 text-slate-400 dark:text-slate-500 animate-spin" />
                </div>
              ) : leads.filter(l => l.status === stage.id).map((lead) => (
                <motion.div 
                  key={lead.id}
                  draggable
                  onDragStart={(e:any) => onDragStart(e, lead.id)}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowLeadDetails(true);
                  }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-grab active:cursor-grabbing group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lead.company || lead.lead_name}
                    </p>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLead(lead);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all"
                        title="Edit lead"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setShowDeleteConfirm(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                        title="Delete lead"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{lead.lead_name}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">{formatCurrency(lead.estimated_value || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Prob.</span>
                      <span className="text-sm font-medium">{lead.probability || 0}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", getStageColor(stage.id))} 
                      style={{ width: `${lead.probability || 0}%` }}
                    ></div>
                  </div>

                  {lead.source && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Source: {lead.source}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              <div className="w-full py-2 text-xs font-bold text-slate-400 dark:text-slate-500 text-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                + Drop lead here
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <AddLeadForm 
          onClose={() => setIsAddModalOpen(false)} 
          onRefresh={fetchLeads} 
        />
      )}

      {/* Edit Lead Modal */}
      {isEditModalOpen && selectedLead && (
        <EditLeadForm
          leadId={selectedLead.id}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLead(null);
          }}
          onRefresh={fetchLeads}
        />
      )}

      {/* Lead Details Modal */}
      <AnimatePresence>
        {showLeadDetails && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lead Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">View and manage lead information</p>
                </div>
                <button 
                  onClick={() => setShowLeadDetails(false)} 
                  className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3" /> Lead Name
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 font-medium">{selectedLead.lead_name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Company
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">{selectedLead.company || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</label>
                    <p className="text-slate-900 dark:text-slate-100">{selectedLead.source}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                    <span className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium text-white", getStageColor(selectedLead.status))}>
                      {getStageTitle(selectedLead.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated Value</label>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">{formatCurrency(selectedLead.estimated_value || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Probability</label>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-900 dark:text-slate-100 font-bold">{selectedLead.probability || 0}%</span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", getStageColor(selectedLead.status))} style={{ width: `${selectedLead.probability || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {selectedLead.email && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{selectedLead.email}</p>
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{selectedLead.phone}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Created
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">{formatDate(selectedLead.created_at)}</p>
                  </div>
                  {selectedLead.notes && (
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notes</label>
                      <p className="text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => setShowLeadDetails(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditLead(selectedLead)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delete Lead</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This action cannot be undone.</p>
              </div>
              <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300">
                  Are you sure you want to delete <span className="font-bold">{selectedLead.lead_name}</span>?
                </p>
                {selectedLead.company && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Company: {selectedLead.company}</p>
                )}
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedLead(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLead}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Delete Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}