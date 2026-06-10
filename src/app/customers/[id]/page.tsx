// app/customers/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  History,
  Activity,
  Plus,
  ArrowLeft,
  Loader2,
  PhoneCall,
  Users,
  Briefcase,
  Hash,
  Edit2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
/* import { getCustomerById, getCustomerNotes, getCustomerStatusHistory, addCustomerNote, updateCustomerStatus } from '@/actions/customerActions';
 */
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

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const fetchData = async () => {
/*     try {
      const [customerData, notesData, historyData] = await Promise.all([
        getCustomerById(params.id),
        getCustomerNotes(params.id),
        getCustomerStatusHistory(params.id)
      ]);
      setCustomer(customerData);
      setNotes(notesData);
      setStatusHistory(historyData);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    } */
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setSubmitting(true);
  /*   try {
      await addCustomerNote(params.id, newNote);
      await fetchData();
      setNewNote('');
      setShowNoteForm(false);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setSubmitting(false);
    } */
  };

  const handleStatusChange = async (newStatus: string) => {
/*     try {
      await updateCustomerStatus(params.id, newStatus as any);
      await fetchData();
      setShowStatusMenu(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } */
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!customer) return <div className="text-center py-20">Customer not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/customers" 
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{customer.company_name}</h1>
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className={cn(
                    "text-xs font-bold px-3 py-1.5 rounded-full border capitalize transition-all hover:opacity-80",
                    statusStyles[customer.status] || statusStyles['inactive']
                  )}
                >
                  {formatStatus(customer.status)}
                </button>
                {showStatusMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10">
                    {Object.keys(statusStyles).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full text-left px-4 py-2 text-sm capitalize hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {formatStatus(status)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Customer ID: {customer.customer_code} • Registered {new Date(customer.registration_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Company Information
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Industry</p>
                  <p className="text-sm text-slate-700">{customer.industry || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Company Size</p>
                  <p className="text-sm text-slate-700 capitalize">{customer.company_size || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Website</p>
                  {customer.website ? (
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {customer.website}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">Not specified</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm text-slate-700">
                    {customer.address ? `${customer.address}, ` : ''}
                    {customer.city ? `${customer.city}, ` : ''}
                    {customer.country || ''}
                    {!customer.address && !customer.city && !customer.country && 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Tax Number / VAT</p>
                  <p className="text-sm text-slate-700">{customer.tax_number || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Health Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2.5 h-2.5 rounded-full", healthStyles[customer.health_score as keyof typeof healthStyles] || 'bg-slate-400')}></div>
                    <span className="text-sm text-slate-700 capitalize">{customer.health_score?.replace('_', ' ') || 'Good'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Contact Information
              </h2>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {customer.contact_person?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{customer.contact_person}</p>
                  <p className="text-xs text-slate-500">Primary Contact</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700 break-all">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{customer.phone}</span>
                </div>
                {customer.secondary_phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{customer.secondary_phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline, Notes, etc. */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'timeline', label: 'Timeline', icon: History },
                { id: 'notes', label: 'Notes', icon: MessageSquare },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'history', label: 'Status History', icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-3 text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Recent Activity</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add Interaction
                    </button>
                  </div>

                  <div className="space-y-6 relative pl-6 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200">
                    {statusHistory.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-9 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center ring-4 ring-white">
                          <History className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Status Changed</p>
                          <p className="text-sm text-slate-600">
                            Status updated from <span className="font-medium">{formatStatus(item.old_status)}</span> to{' '}
                            <span className="font-medium">{formatStatus(item.new_status)}</span>
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
                            <span className="text-xs text-slate-400">by {item.profiles?.full_name || 'System'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {notes.slice(0, 3).map((note) => (
                      <div key={note.id} className="relative">
                        <div className="absolute -left-9 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-white">
                          <MessageSquare className="w-3 h-3 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Note Added</p>
                          <p className="text-sm text-slate-600">{note.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-400">{formatDate(note.created_at)}</span>
                            <span className="text-xs text-slate-400">by {note.profiles?.full_name || 'User'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {statusHistory.length === 0 && notes.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No activity yet. Add a note or update the status to get started.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Customer Notes</h3>
                    <button 
                      onClick={() => setShowNoteForm(!showNoteForm)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Note
                    </button>
                  </div>

                  {showNoteForm && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note about this customer..."
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleAddNote}
                          disabled={submitting}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submitting ? 'Saving...' : 'Save Note'}
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteForm(false);
                            setNewNote('');
                          }}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                              <MessageSquare className="w-3 h-3 text-indigo-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                              {note.profiles?.full_name || 'User'} • {formatDate(note.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700">{note.content}</p>
                      </div>
                    ))}
                    
                    {notes.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No notes yet. Click "Add Note" to add your first note.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-6">Status Change History</h3>
                  <div className="space-y-4">
                    {statusHistory.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <History className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            Status changed from <span className="text-orange-600">{formatStatus(item.old_status)}</span> to{' '}
                            <span className="text-green-600">{formatStatus(item.new_status)}</span>
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
                            <span className="text-xs text-slate-400">by {item.profiles?.full_name || 'System'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {statusHistory.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No status changes recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Document upload feature coming soon.</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Log Call', icon: Phone, color: 'hover:bg-blue-50 hover:text-blue-600' },
                { label: 'Add Note', icon: MessageSquare, color: 'hover:bg-indigo-50 hover:text-indigo-600' },
                { label: 'Upload File', icon: FileText, color: 'hover:bg-emerald-50 hover:text-emerald-600' },
                { label: 'New Ticket', icon: Activity, color: 'hover:bg-orange-50 hover:text-orange-600' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    if (action.label === 'Add Note') setActiveTab('notes');
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-md",
                    action.color
                  )}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}