import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  PackageCheck,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Truck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  Flame,
  Activity,
  BarChart3,
  Box,
  FileSpreadsheet,
  Zap,
  Code,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [llrs, setLlrs] = useState([]);

  useEffect(() => {
    const storedLLRs = JSON.parse(localStorage.getItem('llrs') || '[]');
    setLlrs(storedLLRs);
  }, []);

  // Stats calculation
  const totalLLR = llrs.length;
  const inTransitLLR = llrs.filter(
    (llr) => llr.status === 'In Transit' || llr.status === 'Out for Delivery'
  ).length;
  const deliveredLLR = llrs.filter((llr) => llr.status === 'Delivered').length;
  const bookedLLR = llrs.filter((llr) => llr.status === 'Booked').length;
  const cancelledLLR = llrs.filter((llr) => llr.status === 'Cancelled').length;

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLLR = llrs.filter((llr) => (llr.date || '').startsWith(todayDateStr)).length;

  const totalRevenue = llrs.reduce(
    (acc, curr) => acc + (parseFloat(curr.amount) || 0),
    0
  );

  const deliveryRate = totalLLR > 0 ? Math.round((deliveredLLR / totalLLR) * 100) : 0;
  const transitRate = totalLLR > 0 ? Math.round((inTransitLLR / totalLLR) * 100) : 0;
  const bookedRate = totalLLR > 0 ? Math.round((bookedLLR / totalLLR) * 100) : 0;

  const statsCards = [
    {
      id: 'total-llr',
      title: 'Total Consignments',
      value: totalLLR.toString(),
      change: `${todayLLR} today`,
      icon: FileText,
      iconColor: 'text-blue-400',
      radialColor: '#3b82f6',
      subtext: `${bookedLLR} booked &bull; ${inTransitLLR} on route`,
    },
    {
      id: 'in-transit-llr',
      title: 'Active In Transit',
      value: inTransitLLR.toString(),
      change: 'Live dispatch',
      icon: Clock,
      iconColor: 'text-yellow-400',
      radialColor: '#f59e0b',
      subtext: 'Vehicles on active highway routes',
    },
    {
      id: 'delivered-llr',
      title: 'Delivered Consignments',
      value: deliveredLLR.toString(),
      change: `${deliveryRate}% success`,
      icon: PackageCheck,
      iconColor: 'text-[#ef233c]',
      radialColor: '#ef233c',
      subtext: 'Verified proof of delivery signed',
    },
    {
      id: 'total-revenue',
      title: 'Total Billed Freight',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: 'Freight value',
      icon: IndianRupee,
      iconColor: 'text-purple-400',
      radialColor: '#a855f7',
      subtext: 'Across all active freight accounts',
    },
  ];

  const recentLLRs = llrs.slice(0, 6);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="dashboard-container animate-fade-up">
      {/* 1. Superdesign Style Hero Banner */}
      <div className="superdesign-hero-banner relative p-4 sm:p-7 md:p-10 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-8">
          <div className="max-w-2xl">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3 sm:mb-5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
              </span>
              <span className="text-[10px] sm:text-xs font-medium font-manrope text-red-100/90 tracking-wide">
                A&amp;A Logistics Intelligence 2.0 is live
              </span>
              <ArrowRight size={12} className="text-red-400 shrink-0" />
            </div>

            {/* Gradient Headline */}
            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight font-manrope leading-tight mb-2.5 sm:mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
                Logistics Intelligence
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
                for the{' '}
                <span className="text-[#ef233c] inline-block relative">
                  Future
                  <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#ef233c] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-light leading-relaxed">
              Ship commercial freight and generate official Lorry Receipts 10x faster with AI-grade design intelligence and local sync.
            </p>
          </div>

          <div className="flex flex-row sm:flex-row md:flex-col items-center sm:items-center md:items-end justify-between sm:justify-start gap-2.5 sm:gap-4 w-full md:w-auto mt-1 sm:mt-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-inter text-zinc-300">
              <Calendar size={12} className="text-[#ef233c] shrink-0" />
              <span className="whitespace-nowrap">{currentDateFormatted}</span>
            </div>

            <button
              onClick={() => navigate('/create-llr')}
              className="shiny-cta group text-xs sm:text-sm py-2 px-4 sm:px-6"
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 text-white font-medium whitespace-nowrap">
                Generate LLR <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 text-[#ef233c]" />
              </span>
            </button>
          </div>
        </div>

        {/* Ambient Top Glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, #ef233c, transparent 65%)' }}
        />
      </div>

      {/* 2. Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group relative overflow-hidden p-3.5 sm:p-5 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl shadow-lg flex flex-col justify-between"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`inline-flex p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 ${card.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                    {card.change}
                  </span>
                </div>

                <div className="mt-0.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-manrope text-white tracking-tight block mb-0.5">
                    {card.value}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 font-manrope leading-tight block">
                    {card.title}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 hidden sm:block">
                  <span
                    className="text-[10px] sm:text-[11px] text-zinc-500 font-inter"
                    dangerouslySetInnerHTML={{ __html: card.subtext }}
                  />
                </div>
              </div>

              {/* Radial Hover Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${card.radialColor}, transparent 70%)` }}
              />
            </div>
          );
        })}
      </div>

      {/* 3. Features Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Main Bento Feature: Dispatch System Engine */}
        <div className="lg:col-span-2 group relative overflow-hidden p-4 sm:p-6 md:p-7 border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black hover:border-white/20 transition-all rounded-xl shadow-xl">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#ef233c] shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white font-manrope tracking-tight">
                    Operating System for Freight Dispatch
                  </h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-light">
                    Real-time status breakdown and fleet synchronization
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center text-[10px] sm:text-xs font-mono text-[#ef233c] bg-[#ef233c]/10 border border-[#ef233c]/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold">
                {totalLLR} Records
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="space-y-2.5 sm:space-y-4 my-auto">
              <div className="flex h-2 sm:h-2.5 rounded-full overflow-hidden bg-white/5 gap-1 p-0.5">
                <div
                  style={{ width: `${deliveryRate}%` }}
                  className="bg-emerald-500 rounded-full transition-all duration-500"
                  title={`Delivered: ${deliveredLLR}`}
                />
                <div
                  style={{ width: `${transitRate}%` }}
                  className="bg-amber-500 rounded-full transition-all duration-500"
                  title={`In Transit: ${inTransitLLR}`}
                />
                <div
                  style={{ width: `${bookedRate}%` }}
                  className="bg-blue-500 rounded-full transition-all duration-500"
                  title={`Booked: ${bookedLLR}`}
                />
              </div>

              {/* Clean 2x2 Grid on Mobile & 4-column on Tablets/Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-black border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400 mb-0.5 font-manrope font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Delivered</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold font-manrope text-white">
                    {deliveredLLR} <span className="text-[10px] sm:text-xs font-normal text-zinc-500">({deliveryRate}%)</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-black border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 mb-0.5 font-manrope font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>In Transit</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold font-manrope text-white">
                    {inTransitLLR} <span className="text-[10px] sm:text-xs font-normal text-zinc-500">({transitRate}%)</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-black border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-blue-400 mb-0.5 font-manrope font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span>Booked</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold font-manrope text-white">
                    {bookedLLR} <span className="text-[10px] sm:text-xs font-normal text-zinc-500">({bookedRate}%)</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-black border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-red-400 mb-0.5 font-manrope font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] shrink-0" />
                    <span>Cancelled</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold font-manrope text-white">
                    {cancelledLLR}{' '}
                    <span className="text-[10px] sm:text-xs font-normal text-zinc-500">
                      ({totalLLR > 0 ? Math.round((cancelledLLR / totalLLR) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-zinc-400">All local manifests validated</span>
              <button
                onClick={() => navigate('/all-llr')}
                className="text-xs font-mono text-[#ef233c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                OPEN REGISTRY <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, #ef233c, transparent 70%)' }}
          />
        </div>

        {/* Bento Feature 2: Quick Action Console */}
        <div className="group relative overflow-hidden p-4 sm:p-6 md:p-7 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl flex flex-col justify-between shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-5">
              <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 text-yellow-400 shrink-0">
                <Zap size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-manrope">Instant Dispatch</h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => navigate('/create-llr')}
                className="w-full min-h-[44px] p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between text-left cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ef233c]/20 text-[#ef233c] flex items-center justify-center font-bold shrink-0">
                    <Plus size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-manrope text-white block">Create New LLR</span>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400">Generate consignment note</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-500 group-hover/btn:translate-x-1 group-hover/btn:text-[#ef233c] transition-all shrink-0" />
              </button>

              <button
                onClick={() => navigate('/all-llr')}
                className="w-full min-h-[44px] p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between text-left cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <FileSpreadsheet size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-manrope text-white block">Search Archive</span>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400">Filter past receipts</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-500 group-hover/btn:translate-x-1 group-hover/btn:text-blue-400 transition-all shrink-0" />
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="w-full min-h-[44px] p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between text-left cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-manrope text-white block">Storage Backup Vault</span>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400">Export &amp; import JSON</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-500 group-hover/btn:translate-x-1 group-hover/btn:text-purple-400 transition-all shrink-0" />
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, #f59e0b, transparent 70%)' }}
          />
        </div>
      </div>

      {/* 4. Recent Consignments Registry Card */}
      <div className="p-4 sm:p-6 md:p-7 border border-white/10 bg-black rounded-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#ef233c] shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-manrope tracking-tight">Recent Consignments</h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-light">
                Latest Lorry Receipts registered in your local dispatch queue
              </p>
            </div>
          </div>

          <button
            className="group px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs cursor-pointer self-start sm:self-auto"
            onClick={() => navigate('/all-llr')}
          >
            <span>View All Records</span>
            <ArrowRight size={13} className="text-[#ef233c] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto mt-4 -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="min-w-[680px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-bold text-zinc-400 font-manrope">
                <th className="py-3 px-4">LLR Identifier</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Route (From → To)</th>
                <th className="py-3 px-4">Consignor</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Billed Value</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-inter">
              {recentLLRs.length > 0 ? (
                recentLLRs.map((row) => {
                  const badge = getStatusBadge(row.status);
                  return (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#ef233c]">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            if (row.fullData) {
                              navigate('/preview-llr', {
                                state: { formData: row.fullData },
                              });
                            }
                          }}
                        >
                          {row.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap text-xs">
                        {row.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-zinc-400">{row.from || 'Origin'}</span>
                          <ArrowRight size={12} className="text-[#ef233c]" />
                          <span className="text-white font-semibold">{row.to || 'Dest'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-xs">{row.party}</span>
                          <span className="text-[10px] text-zinc-500">
                            {row.fullData?.consigneeName ? `To: ${row.fullData.consigneeName}` : 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          <Truck size={11} className="text-[#ef233c]" />
                          {row.vehicleNo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                        {typeof row.amount === 'number'
                          ? `₹${row.amount.toLocaleString('en-IN')}`
                          : `₹${parseFloat(row.amount || 0).toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          <span>{badge.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#ef233c]/20 hover:text-[#ef233c] text-zinc-300 text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1"
                          onClick={() => {
                            if (row.fullData) {
                              navigate('/preview-llr', {
                                state: { formData: row.fullData },
                              });
                            } else {
                              navigate('/all-llr');
                            }
                          }}
                        >
                          <span>View</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ef233c] mb-3">
                        <FileText size={22} />
                      </div>
                      <p className="text-sm font-bold font-manrope text-white mb-1">No LLR Records Yet</p>
                      <p className="text-xs text-zinc-400 mb-4">
                        Generate your first official consignment receipt.
                      </p>
                      <button
                        onClick={() => navigate('/create-llr')}
                        className="shiny-cta text-xs py-2 px-5"
                      >
                        Create First LLR
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
