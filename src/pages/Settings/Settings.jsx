import React, { useState, useEffect } from 'react';
import {
  Save,
  Building2,
  FileText,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Flame,
  Zap,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { useToastContext } from '../../components/Layout/Layout';

const defaultCompany = {
  name: 'A&A Logistics',
  address: '123 Transport Hub, Main Highway, Mumbai - 400001',
  phone: '+91 9876543210',
  email: 'contact@aalogistics.com',
  gstin: '27AAAAA0000A1Z5',
  defaultGST: '18',
  defaultBranch: 'Mumbai HO',
};

const SettingCard = ({ icon: Icon, title, subtitle, badge = '', iconColor = 'text-[#ef233c]', children }) => {
  return (
    <div className="relative overflow-hidden p-4 sm:p-6 md:p-7 border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black rounded-xl shadow-xl transition-all hover:border-white/20">
      <div className="flex items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 ${iconColor} flex items-center justify-center font-bold text-xs shrink-0`}>
            <Icon size={17} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-manrope tracking-tight">{title}</h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <span className="text-[9px] sm:text-[10px] font-bold font-manrope px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10 uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

const SettingsField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="noir-input h-10 px-3.5 text-xs"
    />
  </div>
);

const Settings = () => {
  const toast = useToastContext();
  const [company, setCompany] = useState(defaultCompany);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('llr_company') || 'null');
    if (saved) setCompany(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('llr_company', JSON.stringify(company));
    toast?.success('Company profile and billing presets updated.', 'Saved');
  };

  const handleExport = () => {
    const data = localStorage.getItem('llrs') || '[]';
    const llrs = JSON.parse(data);
    if (llrs.length === 0) {
      toast?.warning('No LLR records to export.', 'Export');
      return;
    }
    const blob = new Blob([JSON.stringify(llrs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LLR-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast?.success(
      `Exported ${llrs.length} LLR records as JSON backup.`,
      'Backup Complete'
    );
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid file format');
        const existing = JSON.parse(localStorage.getItem('llrs') || '[]');
        const merged = [
          ...data,
          ...existing.filter((item) => !data.find((d) => d.id === item.id)),
        ];
        localStorage.setItem('llrs', JSON.stringify(merged));
        toast?.success(
          `Imported ${data.length} records. ${merged.length - existing.length} new entries added.`,
          'Import Complete'
        );
      } catch {
        toast?.error(
          'Invalid JSON backup file. Please select a valid backup exported from this app.',
          'Import Failed'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearData = () => {
    if (
      window.confirm(
        '⚠️ This will permanently delete ALL stored LLR records. Are you sure you want to proceed?'
      )
    ) {
      localStorage.removeItem('llrs');
      toast?.success('All LLR records have been erased.', 'Data Cleared');
    }
  };

  const totalLLRs = JSON.parse(localStorage.getItem('llrs') || '[]').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up max-w-5xl mx-auto pb-20">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-6 md:p-7 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold font-manrope text-white tracking-tight flex items-center gap-2">
            System &amp; Company Preferences
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">
            Manage official receipt headers, billing defaults, and local database backup vault.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="shiny-cta text-xs py-2 px-5 font-bold justify-center"
        >
          <Save size={14} className="text-[#ef233c]" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* 2. Company Profile */}
      <SettingCard
        icon={Building2}
        title="Company Information"
        subtitle="Receipt header branding, legal tax identifiers, and support contacts"
        badge="Printed on LLR"
        iconColor="text-[#ef233c]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SettingsField
            label="Logistics Company Name"
            name="name"
            value={company.name}
            onChange={handleChange}
            placeholder="A&A Logistics"
          />
          <SettingsField
            label="Company GSTIN Identifier"
            name="gstin"
            value={company.gstin}
            onChange={handleChange}
            placeholder="27AAAAA0000A1Z5"
          />
          <SettingsField
            label="Primary Phone Number"
            name="phone"
            value={company.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />
          <SettingsField
            label="Official Support Email"
            name="email"
            value={company.email}
            onChange={handleChange}
            placeholder="contact@aalogistics.com"
          />
          <SettingsField
            label="Default GST Tax Rate (%)"
            name="defaultGST"
            value={company.defaultGST}
            onChange={handleChange}
            placeholder="18"
            type="number"
          />
          <SettingsField
            label="Primary Operating Branch"
            name="defaultBranch"
            value={company.defaultBranch}
            onChange={handleChange}
            placeholder="Mumbai HO"
          />
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
              Headquarters Full Address
            </label>
            <textarea
              name="address"
              value={company.address}
              onChange={handleChange}
              placeholder="123 Transport Hub, Main Highway, Mumbai - 400001"
              rows="2"
              className="noir-input px-3.5 py-2.5 text-xs resize-none"
            />
          </div>
        </div>
      </SettingCard>

      {/* 3. Data & Backup Management */}
      <SettingCard
        icon={Database}
        title="Local Storage & Backup Vault"
        subtitle="Export, import, or manage your browser-stored consignment database"
        badge="Offline Ready"
        iconColor="text-blue-400"
      >
        <div className="space-y-5">
          {/* Storage Meter Card */}
          <div className="p-4 rounded-xl bg-black border border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <HardDrive size={19} />
              </div>
              <div>
                <p className="text-sm font-bold font-manrope text-white">
                  Consignment Database Volume
                </p>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  <strong className="text-white font-mono">{totalLLRs}</strong> active LLR records securely cached
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <ShieldCheck size={13} /> Synced Locally
              </span>
            </div>
          </div>

          {/* Backup Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleExport}
              className="btn-secondary-noir h-10 px-4 text-xs font-semibold justify-center"
            >
              <Download size={14} className="text-blue-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="btn-secondary-noir h-10 px-4 text-xs font-semibold justify-center cursor-pointer">
              <Upload size={14} className="text-purple-400" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearData}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-red-500/20 bg-red-500/10 text-[#ef233c] text-xs font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Database</span>
            </button>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-300 text-xs">
            <AlertTriangle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
            <p>
              <strong>Data Security Notice:</strong> Records are stored within your browser's private secure storage. Remember to keep regular JSON export backups before clearing your browser caches.
            </p>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default Settings;
