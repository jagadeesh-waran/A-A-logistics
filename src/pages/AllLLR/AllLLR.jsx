import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  FileStack,
  Download,
  Plus,
  ArrowRight,
  Truck,
  IndianRupee,
  Layers,
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastContext } from '../../components/Layout/Layout';
import './AllLLR.css';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return {
        className: 'status-pill-delivered',
        dotColor: 'bg-emerald-400',
        label: 'Delivered',
      };
    case 'In Transit':
      return {
        className: 'status-pill-transit',
        dotColor: 'bg-amber-400',
        label: 'In Transit',
      };
    case 'Out for Delivery':
      return {
        className: 'status-pill-outfordelivery',
        dotColor: 'bg-purple-400',
        label: 'Out for Delivery',
      };
    case 'Booked':
      return {
        className: 'status-pill-booked',
        dotColor: 'bg-blue-400',
        label: 'Booked',
      };
    case 'Cancelled':
      return {
        className: 'status-pill-cancelled',
        dotColor: 'bg-[#ef233c]',
        label: 'Cancelled',
      };
    default:
      return {
        className: 'status-pill-default',
        dotColor: 'bg-zinc-400',
        label: status || 'Pending',
      };
  }
};

const AllLLR = () => {
  const [llrs, setLlrs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();
  const toast = useToastContext();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const storedLLRs = JSON.parse(localStorage.getItem('llrs') || '[]');
    setLlrs(storedLLRs);
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete LLR ${id}?`)) {
      const updatedLLRs = llrs.filter((llr) => llr.id !== id);
      setLlrs(updatedLLRs);
      localStorage.setItem('llrs', JSON.stringify(updatedLLRs));
      toast?.success(`LLR ${id} deleted successfully.`, 'Deleted');
    }
  };

  const handleView = (llr) => {
    if (llr.fullData) {
      navigate('/preview-llr', { state: { formData: llr.fullData } });
    } else {
      toast?.error('Full LLR data not found for preview.', 'Error');
    }
  };

  const handleEdit = (llr) => {
    if (llr.fullData) {
      navigate('/create-llr', {
        state: { editMode: true, llrData: llr.fullData },
      });
    } else {
      toast?.error('Full LLR data not found for edit.', 'Error');
    }
  };

  const handleExportCSV = () => {
    if (filteredLLRs.length === 0) {
      toast?.warning('No records to export.', 'Export');
      return;
    }
    const headers = [
      'LLR No',
      'Date',
      'From',
      'To',
      'Consignor',
      'Consignee',
      'Truck No',
      'Amount',
      'Status',
    ];
    const rows = filteredLLRs.map((llr) => [
      llr.id,
      llr.date,
      llr.from,
      llr.to,
      llr.fullData?.consignorName || llr.party || '',
      llr.fullData?.consigneeName || '',
      llr.vehicleNo,
      llr.amount,
      llr.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LLR-Registry-Export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast?.success(`Exported ${filteredLLRs.length} records as CSV.`, 'Export');
  };

  const filteredLLRs = llrs
    .filter((llr) => {
      const consignor = llr.fullData?.consignorName || llr.party || '';
      const matchesSearch =
        (llr.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (llr.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        consignor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (llr.fullData?.consigneeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (llr.from || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (llr.to || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || llr.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const totalFilteredAmount = filteredLLRs.reduce(
    (acc, l) => acc + (parseFloat(l.amount) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-up max-w-[1440px] mx-auto pb-20">
      {/* 1. Header Bar */}
      <div className="p-6 md:p-7 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ef233c]">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold font-manrope text-white tracking-tight">Consignment Registry</h1>
              <span className="text-xs font-mono font-bold text-[#ef233c] bg-[#ef233c]/10 border border-[#ef233c]/30 px-2.5 py-0.5 rounded-full">
                {llrs.length} Total
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Centralized digital archive of all generated Lorry Loading Receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="group px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <Download size={14} className="text-[#ef233c]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => navigate('/create-llr')}
            className="shiny-cta text-xs py-2 px-5 font-bold"
          >
            <Plus size={14} className="text-[#ef233c]" />
            <span>New LLR</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-black shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-white/10">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
            <input
              type="text"
              placeholder="Search by LLR #, Party, Dest, Truck..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-9 pl-9 pr-8 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ef233c] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            {/* Status Select */}
            <div className="relative flex items-center">
              <Filter size={13} className="absolute left-3 text-zinc-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 pl-8 pr-7 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 cursor-pointer focus:outline-none focus:border-[#ef233c] transition-all"
              >
                <option value="All" className="bg-zinc-950">All Statuses</option>
                <option value="Booked" className="bg-zinc-950">Booked</option>
                <option value="In Transit" className="bg-zinc-950">In Transit</option>
                <option value="Out for Delivery" className="bg-zinc-950">Out for Delivery</option>
                <option value="Delivered" className="bg-zinc-950">Delivered</option>
                <option value="Cancelled" className="bg-zinc-950">Cancelled</option>
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
              }
              className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowUpDown size={12} className="text-[#ef233c]" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* 3. Table Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-bold text-zinc-400 font-manrope">
                <th className="py-3 px-4">LLR Number</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Route (From → To)</th>
                <th className="py-3 px-4">Consignor &amp; Consignee</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-inter">
              {filteredLLRs.length > 0 ? (
                filteredLLRs.map((llr) => {
                  const badge = getStatusBadge(llr.status);
                  return (
                    <tr key={llr.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#ef233c]">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => handleView(llr)}
                          title="Click to preview receipt"
                        >
                          {llr.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap text-xs">
                        {llr.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-zinc-400">{llr.from}</span>
                          <ArrowRight size={12} className="text-[#ef233c]" />
                          <span className="text-white font-semibold">{llr.to}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-xs">
                            {llr.fullData?.consignorName || llr.party}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {llr.fullData?.consigneeName ? `To: ${llr.fullData.consigneeName}` : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          <Truck size={11} className="text-[#ef233c]" />
                          {llr.vehicleNo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                        ₹{parseFloat(llr.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          <span>{badge.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleView(llr)}
                            title="Preview LLR Receipt"
                            className="p-1.5 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-zinc-400 transition-all cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handleEdit(llr)}
                            title="Edit LLR Data"
                            className="p-1.5 rounded bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 text-zinc-400 transition-all cursor-pointer"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(llr.id)}
                            title="Delete LLR Record"
                            className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 hover:text-[#ef233c] text-zinc-400 transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ef233c] mb-3">
                        <FileStack size={22} />
                      </div>
                      <p className="text-sm font-bold font-manrope text-white mb-1">No Consignments Found</p>
                      <p className="text-xs text-zinc-400 mb-4">
                        {searchTerm || statusFilter !== 'All'
                          ? 'Try resetting your search query or filter.'
                          : 'You have not created any Lorry Receipts yet.'}
                      </p>
                      {(!searchTerm && statusFilter === 'All') && (
                        <button
                          onClick={() => navigate('/create-llr')}
                          className="shiny-cta text-xs py-2 px-5"
                        >
                          Create New LLR
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Footer Summary */}
        {filteredLLRs.length > 0 && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-inter text-zinc-400 flex-wrap gap-2">
            <span>
              Showing <strong className="text-white font-manrope">{filteredLLRs.length}</strong> of{' '}
              <strong className="text-white font-manrope">{llrs.length}</strong> records
            </span>
            <div className="flex items-center gap-2">
              <span>Filtered Total:</span>
              <span className="font-mono font-bold text-white text-sm">
                ₹{totalFilteredAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLLR;
