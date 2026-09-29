import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Eye,
  FilePlus,
  Edit2,
  Truck,
  Hash,
  User,
  Package,
  IndianRupee,
  Receipt,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  ShieldCheck,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToastContext } from '../../components/Layout/Layout';

/* ─── Superdesign Section Card ───────────────────────────────────────────── */
const SectionCard = ({
  number,
  title,
  subtitle,
  icon: Icon,
  badge = '',
  iconColor = 'text-[#ef233c]',
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden p-6 md:p-7 border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black rounded-xl shadow-xl transition-all hover:border-white/20 ${className}`}
    >
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 ${iconColor} flex items-center justify-center font-bold text-xs flex-shrink-0`}
          >
            {Icon ? <Icon size={18} /> : String(number).padStart(2, '0')}
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-manrope tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-zinc-400 font-light">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className="text-[10px] font-bold font-manrope px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10 uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error,
  className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`h-10 px-3.5 rounded-lg border text-xs transition-all duration-150 outline-none
        ${
          readOnly
            ? 'bg-white/[0.02] text-zinc-500 border-white/[0.08] cursor-not-allowed font-mono'
            : error
            ? 'bg-red-950/40 text-white border-[#ef233c] focus:ring-2 focus:ring-[#ef233c]/30'
            : 'noir-input'
        }`}
    />
    {error && <span className="text-xs text-[#ef233c] animate-fade-up">{error}</span>}
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="h-10 px-3.5 rounded-lg border border-white/10 bg-zinc-950 text-xs text-white transition-all duration-150 outline-none hover:border-white/20 focus:border-[#ef233c]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-zinc-950 text-white">
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const FormTextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="3"
      className="px-3.5 py-2.5 rounded-lg border border-white/10 text-xs bg-white/5 text-white placeholder:text-zinc-600 transition-all duration-150 outline-none hover:border-white/20 focus:border-[#ef233c] resize-none"
    />
  </div>
);

/* ─── Helpers ──────────────────────────────────────────────────── */
const getTodayDate = () => new Date().toISOString().split('T')[0];

const generateLLRNumber = () => {
  const existing = JSON.parse(localStorage.getItem('llrs') || '[]');
  const year = new Date().getFullYear();
  const nums = existing
    .map((l) => {
      const m = (l.id || '').match(/LLR-\d{4}-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `LLR-${year}-${String(next).padStart(4, '0')}`;
};

const emptyGoodsRow = () => ({
  id: Date.now(),
  packages: '',
  description: '',
  actualWeight: '',
  chargedWeight: '',
  rate: '',
});

const initialFormState = () => ({
  llrNumber: generateLLRNumber(),
  bookingDate: getTodayDate(),
  from: '',
  to: '',
  bookingBranch: '',
  consignorName: '',
  consignorGSTIN: '',
  consignorAddress: '',
  consignorMobile: '',
  consigneeName: '',
  consigneeGSTIN: '',
  consigneeAddress: '',
  consigneeMobile: '',
  truckNumber: '',
  driverName: '',
  driverMobile: '',
  freightCharges: '',
  labourCharges: '',
  statisticalCharges: '',
  gstPercentage: '',
  totalAmount: '',
  remarks: '',
  status: 'Booked',
});

/* ─── Main Component ───────────────────────────────────────────── */
const CreateLLR = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastContext();

  const editMode = location.state?.editMode || false;
  const editData = location.state?.llrData;

  const [formData, setFormData] = useState(() => {
    if (editMode && editData) {
      return {
        llrNumber: editData.llrNumber || '',
        bookingDate: editData.bookingDate || getTodayDate(),
        from: editData.from || '',
        to: editData.to || '',
        bookingBranch: editData.bookingBranch || '',
        consignorName: editData.consignorName || '',
        consignorGSTIN: editData.consignorGSTIN || '',
        consignorAddress: editData.consignorAddress || '',
        consignorMobile: editData.consignorMobile || '',
        consigneeName: editData.consigneeName || '',
        consigneeGSTIN: editData.consigneeGSTIN || '',
        consigneeAddress: editData.consigneeAddress || '',
        consigneeMobile: editData.consigneeMobile || '',
        truckNumber: editData.truckNumber || '',
        driverName: editData.driverName || '',
        driverMobile: editData.driverMobile || '',
        freightCharges: editData.freightCharges || '',
        labourCharges: editData.labourCharges || '',
        statisticalCharges: editData.statisticalCharges || '',
        gstPercentage: editData.gstPercentage || '',
        totalAmount: editData.totalAmount || '',
        remarks: editData.remarks || '',
        status: editData.status || 'Booked',
      };
    }
    return initialFormState();
  });

  const [goodsRows, setGoodsRows] = useState(() => {
    if (editMode && editData?.goodsRows?.length) return editData.goodsRows;
    if (editMode && editData) {
      return [
        {
          id: Date.now(),
          packages: editData.packagesCount || '',
          description: editData.goodsDescription || '',
          actualWeight: editData.actualWeight || '',
          chargedWeight: editData.chargedWeight || '',
          rate: editData.rate || '',
        },
      ];
    }
    return [emptyGoodsRow()];
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleGoodsChange = (id, field, value) => {
    setGoodsRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    if (errors.goods) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n.goods;
        return n;
      });
    }
  };

  const addGoodsRow = () => setGoodsRows((prev) => [...prev, emptyGoodsRow()]);

  const removeGoodsRow = (id) => {
    if (goodsRows.length === 1) {
      toast?.warning('At least one goods row is required.');
      return;
    }
    setGoodsRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Compute live billing
  useEffect(() => {
    const freight = parseFloat(formData.freightCharges) || 0;
    const labour = parseFloat(formData.labourCharges) || 0;
    const stats = parseFloat(formData.statisticalCharges) || 0;
    const gst = parseFloat(formData.gstPercentage) || 0;
    const subtotal = freight + labour + stats;
    const total = subtotal + subtotal * (gst / 100);
    setFormData((prev) => ({
      ...prev,
      totalAmount: total > 0 ? total.toFixed(2) : '',
    }));
  }, [
    formData.freightCharges,
    formData.labourCharges,
    formData.statisticalCharges,
    formData.gstPercentage,
  ]);

  const totalPackages = goodsRows.reduce(
    (s, r) => s + (parseInt(r.packages) || 0),
    0
  );
  const totalActualWeight = goodsRows.reduce(
    (s, r) => s + (parseFloat(r.actualWeight) || 0),
    0
  );
  const totalChargedWeight = goodsRows.reduce(
    (s, r) => s + (parseFloat(r.chargedWeight) || 0),
    0
  );

  const validate = () => {
    const e = {};
    if (!formData.llrNumber.trim()) e.llrNumber = 'LLR Number is required';
    if (!formData.bookingDate) e.bookingDate = 'Booking Date is required';
    if (!formData.from.trim()) e.from = 'From location is required';
    if (!formData.to.trim()) e.to = 'To location is required';
    if (!formData.consignorName.trim())
      e.consignorName = 'Consignor Name is required';
    if (!formData.consigneeName.trim())
      e.consigneeName = 'Consignee Name is required';
    if (!formData.truckNumber.trim())
      e.truckNumber = 'Vehicle Number is required';
    const hasGoods = goodsRows.some(
      (r) => r.packages || r.description.trim() || r.actualWeight
    );
    if (!hasGoods) e.goods = 'At least one goods item must be filled.';
    return e;
  };

  const handleReset = () => {
    if (editMode) {
      if (window.confirm('Discard all edits and go back?')) navigate(-1);
    } else {
      if (window.confirm('Reset the form? All entered data will be lost.')) {
        setFormData(initialFormState());
        setGoodsRows([emptyGoodsRow()]);
        setErrors({});
      }
    }
  };

  const handlePreview = () => {
    const fullData = { ...formData, goodsRows };
    navigate('/preview-llr', { state: { formData: fullData } });
  };

  const buildLLRRecord = () => ({
    id: formData.llrNumber,
    date: formData.bookingDate || getTodayDate(),
    from: formData.from,
    to: formData.to,
    party: formData.consignorName,
    vehicleNo: formData.truckNumber || 'N/A',
    amount: formData.totalAmount ? parseFloat(formData.totalAmount) : 0,
    status: formData.status || 'Booked',
    fullData: { ...formData, goodsRows },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast?.error(
        'Please complete all required fields before saving.',
        'Validation Alert'
      );
      return;
    }

    const existing = JSON.parse(localStorage.getItem('llrs') || '[]');

    if (editMode) {
      const updated = existing.map((llr) =>
        llr.id === formData.llrNumber ? buildLLRRecord() : llr
      );
      localStorage.setItem('llrs', JSON.stringify(updated));
      toast?.success(`LLR ${formData.llrNumber} updated successfully!`, 'Updated');
    } else {
      localStorage.setItem(
        'llrs',
        JSON.stringify([buildLLRRecord(), ...existing])
      );
      toast?.success(`LLR ${formData.llrNumber} saved successfully!`, 'Saved');
    }

    setTimeout(() => navigate('/all-llr'), 500);
  };

  const statusOptions = [
    { value: 'Booked', label: 'Booked (Pending Dispatch)' },
    { value: 'In Transit', label: 'In Transit (On Highway)' },
    { value: 'Out for Delivery', label: 'Out for Delivery (Local Hub)' },
    { value: 'Delivered', label: 'Delivered (Completed)' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-fade-up max-w-[1400px] mx-auto pb-20">
      {/* 1. Header & Actions Bar */}
      <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ef233c]/15 border border-[#ef233c]/30 flex items-center justify-center text-[#ef233c]">
            {editMode ? <Edit2 size={18} /> : <FilePlus size={18} />}
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-manrope flex items-center gap-2">
              {editMode ? 'Edit Consignment Record' : 'Generate Lorry Receipt (LLR)'}
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ef233c]/15 text-[#ef233c] border border-[#ef233c]/30 font-mono font-bold">
                {editMode ? 'REVISION' : 'NEW DRAFT'}
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              {editMode
                ? `Editing consignment manifest for ${formData.llrNumber}`
                : 'Fill parameters below to generate an official commercial consignment note'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 bg-black border border-white/10 rounded-full px-4 py-1.5 mr-1">
            <Hash size={12} className="text-[#ef233c]" />
            <span className="text-xs font-mono font-bold text-zinc-300">
              {formData.llrNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary-noir h-9 px-4 text-xs"
          >
            <RotateCcw size={13} />
            <span>{editMode ? 'Cancel' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="btn-secondary-noir h-9 px-4 text-xs"
          >
            <Eye size={13} className="text-blue-400" />
            <span>Preview LLR</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="shiny-cta py-2 px-5 text-xs font-bold"
          >
            <Save size={13} className="text-[#ef233c]" />
            <span>{editMode ? 'Update Record' : 'Save & Ship LLR'}</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Sections Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Booking & Dispatch Route */}
        <SectionCard
          number={1}
          title="Booking & Dispatch Route"
          subtitle="Origin & destination hubs and booking branch"
          icon={Receipt}
          iconColor="text-blue-400"
          badge="Required"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              label="LLR Identifier #"
              name="llrNumber"
              value={formData.llrNumber}
              onChange={handleChange}
              placeholder="Auto-generated"
              error={errors.llrNumber}
            />
            <FormField
              label="Booking Date"
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              error={errors.bookingDate}
            />
            <FormField
              label="Booking Operating Branch"
              name="bookingBranch"
              value={formData.bookingBranch}
              onChange={handleChange}
              placeholder="e.g. Mumbai Main Hub"
            />
            <FormSelect
              label="Consignment Dispatch Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
            <FormField
              label="Origin City (From)"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              error={errors.from}
            />
            <FormField
              label="Destination City (To)"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="e.g. New Delhi"
              error={errors.to}
            />
          </div>
        </SectionCard>

        {/* Section 2 & 3: Consignor & Consignee */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 2: Consignor Details */}
          <SectionCard
            number={2}
            title="Consignor Details"
            subtitle="Sender organization & contact details"
            icon={User}
            iconColor="text-yellow-400"
            badge="Sender"
          >
            <div className="space-y-4">
              <FormField
                label="Consignor Full Name / Firm"
                name="consignorName"
                value={formData.consignorName}
                onChange={handleChange}
                placeholder="e.g. Reliance Logistics Ltd"
                error={errors.consignorName}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="GSTIN Identifier"
                  name="consignorGSTIN"
                  value={formData.consignorGSTIN}
                  onChange={handleChange}
                  placeholder="27XXXXX1234X1ZX"
                />
                <FormField
                  label="Contact Phone"
                  name="consignorMobile"
                  value={formData.consignorMobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
              <FormTextArea
                label="Complete Sender Address"
                name="consignorAddress"
                value={formData.consignorAddress}
                onChange={handleChange}
                placeholder="Plot No, Industrial Area, City, Pincode"
              />
            </div>
          </SectionCard>

          {/* Section 3: Consignee Details */}
          <SectionCard
            number={3}
            title="Consignee Details"
            subtitle="Receiving party & destination dock"
            icon={User}
            iconColor="text-purple-400"
            badge="Receiver"
          >
            <div className="space-y-4">
              <FormField
                label="Consignee Full Name / Firm"
                name="consigneeName"
                value={formData.consigneeName}
                onChange={handleChange}
                placeholder="e.g. Tata Consumer Products"
                error={errors.consigneeName}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="GSTIN Identifier"
                  name="consigneeGSTIN"
                  value={formData.consigneeGSTIN}
                  onChange={handleChange}
                  placeholder="07XXXXX1234X1ZX"
                />
                <FormField
                  label="Contact Phone"
                  name="consigneeMobile"
                  value={formData.consigneeMobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
              <FormTextArea
                label="Complete Delivery Destination Address"
                name="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={handleChange}
                placeholder="Warehouse / Receiving dock address, City, Pincode"
              />
            </div>
          </SectionCard>
        </div>

        {/* Section 4: Goods Table */}
        <SectionCard
          number={4}
          title="Consigned Goods & Package Items"
          subtitle="Itemized package inventory and weight metrics"
          icon={Package}
          iconColor="text-emerald-400"
          badge="Itemized"
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse mb-4 font-inter">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-bold text-zinc-400 font-manrope">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3 w-24">Packages</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Description of Goods</th>
                  <th className="py-2.5 px-3 w-28">Act. Wt (kg)</th>
                  <th className="py-2.5 px-3 w-28">Chg. Wt (kg)</th>
                  <th className="py-2.5 px-3 w-28">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-center w-14">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {goodsRows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="py-2 px-3 text-zinc-500 font-mono text-xs font-bold">
                      {index + 1}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.packages}
                        onChange={(e) =>
                          handleGoodsChange(row.id, 'packages', e.target.value)
                        }
                        placeholder="0"
                        className="noir-input w-full h-9 px-2 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleGoodsChange(row.id, 'description', e.target.value)
                        }
                        placeholder="e.g. Industrial Machinery Components"
                        className="noir-input w-full h-9 px-2.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.actualWeight}
                        onChange={(e) =>
                          handleGoodsChange(row.id, 'actualWeight', e.target.value)
                        }
                        placeholder="0.00"
                        className="noir-input w-full h-9 px-2 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.chargedWeight}
                        onChange={(e) =>
                          handleGoodsChange(row.id, 'chargedWeight', e.target.value)
                        }
                        placeholder="0.00"
                        className="noir-input w-full h-9 px-2 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleGoodsChange(row.id, 'rate', e.target.value)
                        }
                        placeholder="0.00"
                        className="noir-input w-full h-9 px-2 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeGoodsRow(row.id)}
                        className="p-1.5 text-zinc-500 hover:text-[#ef233c] hover:bg-white/5 rounded transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {goodsRows.length > 1 && (
                <tfoot>
                  <tr className="border-t border-white/10 font-bold text-xs text-zinc-300 font-manrope">
                    <td className="py-2.5 px-3 text-zinc-500">Totals</td>
                    <td className="py-2.5 px-3 text-blue-400 font-mono">
                      {totalPackages > 0 ? totalPackages : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-600">—</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono">
                      {totalActualWeight > 0 ? `${totalActualWeight.toFixed(2)} kg` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono">
                      {totalChargedWeight > 0 ? `${totalChargedWeight.toFixed(2)} kg` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-600">—</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>

            {errors.goods && (
              <p className="text-xs text-[#ef233c] mb-3 animate-fade-up">{errors.goods}</p>
            )}

            <button
              type="button"
              onClick={addGoodsRow}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-manrope font-semibold transition-all cursor-pointer"
            >
              <Plus size={13} className="text-[#ef233c]" />
              <span>Add Another Item</span>
            </button>
          </div>
        </SectionCard>

        {/* Section 5: Transport & Carrier Dispatch */}
        <SectionCard
          number={5}
          title="Carrier & Vehicle Dispatch"
          subtitle="Assigned truck fleet registration and driver contact"
          icon={Truck}
          iconColor="text-yellow-400"
          badge="Fleet"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              label="Truck / Vehicle Registration #"
              name="truckNumber"
              value={formData.truckNumber}
              onChange={handleChange}
              placeholder="e.g. MH 04 AB 1234"
              error={errors.truckNumber}
            />
            <FormField
              label="Assigned Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Driver's full name"
            />
            <FormField
              label="Driver Contact Phone"
              name="driverMobile"
              value={formData.driverMobile}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>
        </SectionCard>

        {/* Section 6: Freight Charges & Billing Summary */}
        <SectionCard
          number={6}
          title="Freight Charges & Billing Summary"
          subtitle="Itemized charges, GST tax rate, and net total calculation"
          icon={IndianRupee}
          iconColor="text-[#ef233c]"
          badge="Auto-Calculated"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              label="Basic Freight Charges (₹)"
              type="number"
              name="freightCharges"
              value={formData.freightCharges}
              onChange={handleChange}
              placeholder="0.00"
            />
            <FormField
              label="Labour / Hamali Charges (₹)"
              type="number"
              name="labourCharges"
              value={formData.labourCharges}
              onChange={handleChange}
              placeholder="0.00"
            />
            <FormField
              label="Statistical / Documentation Charges (₹)"
              type="number"
              name="statisticalCharges"
              value={formData.statisticalCharges}
              onChange={handleChange}
              placeholder="0.00"
            />
            <FormField
              label="Applicable GST (%)"
              type="number"
              name="gstPercentage"
              value={formData.gstPercentage}
              onChange={handleChange}
              placeholder="5 or 18"
            />

            {/* Total Grand Highlight Box (Superdesign Pro card style) */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <label className="text-[11px] font-bold font-manrope text-zinc-400 uppercase tracking-wider mb-1.5">
                Total Billed Amount (Auto-Calculated)
              </label>
              <div className="relative p-4 rounded-xl border border-[#ef233c] bg-zinc-900/40 shadow-[0_0_30px_rgba(239,35,60,0.15)] flex items-center justify-between">
                <span className="text-xs uppercase font-bold font-manrope tracking-wider text-zinc-300">
                  Total Payable Freight
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  {formData.totalAmount
                    ? `₹ ${parseFloat(formData.totalAmount).toLocaleString('en-IN')}`
                    : '₹ 0.00'}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 7: Remarks */}
        <SectionCard
          number={7}
          title="Consignment Remarks & Special Instructions"
          subtitle="Handling instructions, delivery windows, and precautions"
          icon={MessageSquare}
          iconColor="text-zinc-400"
        >
          <FormTextArea
            label="Special Delivery Notes / Handling Instructions"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="e.g. Fragile goods. Store in dry place. Delivery between 9 AM to 6 PM."
            className="w-full"
          />
        </SectionCard>
      </form>
    </div>
  );
};

export default CreateLLR;
