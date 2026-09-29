import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Printer, Download, Save, FileCheck, Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useToastContext } from '../../components/Layout/Layout';

const PreviewLLR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const llrRef = useRef(null);
  const toast = useToastContext();

  const formData = location.state?.formData || {};
  const goodsRows = formData.goodsRows || [];

  // Fallback for legacy single-item LLRs
  const legacyRow = {
    id: 'legacy',
    packages: formData.packagesCount || '',
    description: formData.goodsDescription || '',
    actualWeight: formData.actualWeight || '',
    chargedWeight: formData.chargedWeight || '',
    rate: formData.rate || '',
  };
  const displayRows =
    goodsRows.length > 0
      ? goodsRows
      : legacyRow.description || legacyRow.packages
      ? [legacyRow]
      : [];

  const totalPackages = displayRows.reduce(
    (s, r) => s + (parseInt(r.packages) || 0),
    0
  );
  const totalActualWeight = displayRows.reduce(
    (s, r) => s + (parseFloat(r.actualWeight) || 0),
    0
  );
  const totalChargedWeight = displayRows.reduce(
    (s, r) => s + (parseFloat(r.chargedWeight) || 0),
    0
  );

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate('/create-llr', { state: { editMode: true, llrData: formData } });
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  const handleDownloadPDF = (e) => {
    e.preventDefault();
    const element = llrRef.current;
    if (!element) return;
    const opt = {
      margin: [3, 3, 3, 3],
      filename: `LLR-${formData.llrNumber || 'draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    };

    setTimeout(() => {
      html2pdf().set(opt).from(element).save();
      toast?.success(
        `LLR-${formData.llrNumber || 'draft'}.pdf generated and downloaded.`,
        'PDF Exported'
      );
    }, 100);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const existingLLRs = JSON.parse(localStorage.getItem('llrs') || '[]');
    const llrNumber =
      formData.llrNumber ||
      `LLR-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
    const existingIndex = existingLLRs.findIndex(
      (llr) => llr.id === llrNumber
    );

    const llrData = {
      id: llrNumber,
      date: formData.bookingDate || new Date().toISOString().split('T')[0],
      from: formData.from,
      to: formData.to,
      party: formData.consignorName,
      vehicleNo: formData.truckNumber || 'N/A',
      amount: formData.totalAmount ? parseFloat(formData.totalAmount) : 0,
      status: existingIndex >= 0 ? existingLLRs[existingIndex].status : 'Booked',
      fullData: { ...formData, llrNumber },
    };

    if (existingIndex >= 0) {
      const updated = [...existingLLRs];
      updated[existingIndex] = llrData;
      localStorage.setItem('llrs', JSON.stringify(updated));
      toast?.success(`LLR ${llrNumber} updated in database.`, 'Updated');
    } else {
      localStorage.setItem('llrs', JSON.stringify([llrData, ...existingLLRs]));
      toast?.success(`LLR ${llrNumber} saved to database.`, 'Saved');
    }

    setTimeout(() => navigate('/all-llr'), 500);
  };

  // Derived charge calculations
  const freight = parseFloat(formData.freightCharges) || 0;
  const labour = parseFloat(formData.labourCharges) || 0;
  const statistical = parseFloat(formData.statisticalCharges) || 0;
  const gstPct = parseFloat(formData.gstPercentage) || 0;
  const subtotal = freight + labour + statistical;
  const gstAmount = subtotal * (gstPct / 100);

  return (
    <div className="min-h-screen flex flex-col items-center animate-fade-up w-full">
      {/* 1. Sticky Action Toolbar */}
      <div className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-2xl text-white border-b border-white/10 shadow-2xl print:hidden">
        <div className="max-w-[210mm] mx-auto flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={handleBack}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-inter text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-inter text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 size={13} className="text-yellow-400" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-inter text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print LLR</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-inter text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download size={13} className="text-[#ef233c]" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={handleSave}
              className="shiny-cta py-1.5 px-3 sm:px-4 text-xs font-bold whitespace-nowrap"
            >
              <Save size={13} className="text-[#ef233c]" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Official LORRY RECEIPT Document Sheet */}
      <div className="w-full overflow-x-auto py-4 sm:py-8 px-2 sm:px-4 flex justify-start sm:justify-center print:p-0 print:overflow-visible">
        <div className="min-w-[640px] sm:min-w-0 w-full max-w-[210mm] bg-white border border-zinc-300 shadow-2xl rounded-sm print:shadow-none print:border-none print:min-w-0">
          <div
            ref={llrRef}
            className="p-4 sm:p-6 border-4 border-double border-black m-1 sm:m-2 min-h-[285mm] flex flex-col text-sm text-black font-sans print:m-0 print:min-h-0 bg-white"
          >
            {/* Document Header */}
            <div className="text-center pb-3 border-b-2 border-black">
              <h1 className="text-3xl font-black uppercase tracking-wider text-black">
                A&amp;A LOGISTICS
              </h1>
              <p className="text-sm font-semibold text-black">
                123 Transport Hub, Main Highway, Mumbai - 400001
              </p>
              <p className="text-xs text-black">
                Phone: +91 9876543210 | Email: contact@aalogistics.com
              </p>
              <p className="text-xs font-bold mt-0.5 text-black">GSTIN: 27AAAAA0000A1Z5</p>
            </div>

            <div className="text-center py-1.5 font-bold uppercase text-base border-b-2 border-black tracking-widest bg-gray-100 print:bg-transparent text-black">
              LORRY RECEIPT / CONSIGNMENT NOTE
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 border-b-2 border-black divide-x-2 divide-black">
              <div className="p-2.5 space-y-1 text-xs">
                <p>
                  <span className="font-bold text-black">LLR No:</span>{' '}
                  <span className="font-mono font-bold text-sm text-black">
                    {formData.llrNumber}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-black">Booking Date:</span>{' '}
                  <span className="text-black">{formData.bookingDate}</span>
                </p>
                <p>
                  <span className="font-bold text-black">Branch:</span>{' '}
                  <span className="text-black">{formData.bookingBranch || 'Mumbai Main HO'}</span>
                </p>
              </div>
              <div className="p-2.5 space-y-1 text-xs">
                <p>
                  <span className="font-bold text-black">Origin City (From):</span>{' '}
                  <span className="font-semibold text-black">{formData.from}</span>
                </p>
                <p>
                  <span className="font-bold text-black">Destination (To):</span>{' '}
                  <span className="font-semibold text-black">{formData.to}</span>
                </p>
                <p>
                  <span className="font-bold text-black">Status:</span>{' '}
                  <span className="text-black">{formData.status}</span>
                </p>
              </div>
            </div>

            {/* Consignor & Consignee */}
            <div className="grid grid-cols-2 border-b-2 border-black divide-x-2 divide-black">
              <div className="p-2.5">
                <h3 className="font-bold border-b border-black inline-block mb-1 text-xs uppercase text-black">
                  Consignor Details (Sender)
                </h3>
                <p className="font-bold mt-1 text-sm text-black">{formData.consignorName}</p>
                <p className="whitespace-pre-line text-xs mt-1 text-gray-800">
                  {formData.consignorAddress}
                </p>
                <p className="mt-1 text-xs text-black">
                  <span className="font-bold">Phone:</span> {formData.consignorMobile}
                </p>
                <p className="mt-0.5 text-xs text-black">
                  <span className="font-bold">GSTIN:</span> {formData.consignorGSTIN}
                </p>
              </div>
              <div className="p-2.5">
                <h3 className="font-bold border-b border-black inline-block mb-1 text-xs uppercase text-black">
                  Consignee Details (Receiver)
                </h3>
                <p className="font-bold mt-1 text-sm text-black">{formData.consigneeName}</p>
                <p className="whitespace-pre-line text-xs mt-1 text-gray-800">
                  {formData.consigneeAddress}
                </p>
                <p className="mt-1 text-xs text-black">
                  <span className="font-bold">Phone:</span> {formData.consigneeMobile}
                </p>
                <p className="mt-0.5 text-xs text-black">
                  <span className="font-bold">GSTIN:</span> {formData.consigneeGSTIN}
                </p>
              </div>
            </div>

            {/* Transport & Carrier Info */}
            <div className="grid grid-cols-3 border-b-2 border-black divide-x-2 divide-black">
              <div className="p-2 text-center">
                <span className="font-bold text-[11px] uppercase block mb-0.5 text-black">
                  Truck Registration #
                </span>
                <span className="font-bold font-mono text-sm text-black">
                  {formData.truckNumber || '—'}
                </span>
              </div>
              <div className="p-2 text-center">
                <span className="font-bold text-[11px] uppercase block mb-0.5 text-black">
                  Assigned Driver
                </span>
                <span className="font-semibold text-xs text-black">
                  {formData.driverName || '—'}
                </span>
              </div>
              <div className="p-2 text-center">
                <span className="font-bold text-[11px] uppercase block mb-0.5 text-black">
                  Driver Mobile
                </span>
                <span className="font-semibold text-xs text-black">
                  {formData.driverMobile || '—'}
                </span>
              </div>
            </div>

            {/* Goods Table + Charges Breakdown */}
            <div className="flex border-b-2 border-black divide-x-2 divide-black flex-grow min-h-[190px]">
              {/* Goods Table - Left 70% */}
              <div className="w-[70%] flex flex-col">
                <div className="grid grid-cols-5 border-b-2 border-black font-bold text-center text-xs uppercase bg-gray-100 print:bg-transparent text-black">
                  <div className="p-1.5 border-r border-black">Pkgs</div>
                  <div className="p-1.5 border-r border-black col-span-2">
                    Description of Goods
                  </div>
                  <div className="p-1.5 border-r border-black">Act. Wt</div>
                  <div className="p-1.5">Chg. Wt / Rate</div>
                </div>
                <div className="flex-grow">
                  {displayRows.map((row, i) => (
                    <div
                      key={row.id || i}
                      className="grid grid-cols-5 border-b border-dashed border-black text-xs text-black"
                    >
                      <div className="p-1.5 border-r border-black text-center font-semibold">
                        {row.packages || '—'}
                      </div>
                      <div className="p-1.5 border-r border-black col-span-2">
                        {row.description || '—'}
                      </div>
                      <div className="p-1.5 border-r border-black text-center">
                        {row.actualWeight ? `${row.actualWeight} kg` : '—'}
                      </div>
                      <div className="p-1.5 text-xs leading-snug">
                        <div>
                          {row.chargedWeight ? `${row.chargedWeight} kg` : '—'}
                        </div>
                        <div className="text-gray-700 font-semibold">₹{row.rate || '0'}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals row */}
                {displayRows.length > 1 && (
                  <div className="grid grid-cols-5 bg-gray-50 text-xs font-bold border-t border-black print:bg-transparent text-black">
                    <div className="p-1.5 border-r border-black text-center font-bold">
                      {totalPackages || '—'}
                    </div>
                    <div className="p-1.5 border-r border-black col-span-2 text-gray-600 italic">
                      Total Consignment
                    </div>
                    <div className="p-1.5 border-r border-black text-center">
                      {totalActualWeight > 0
                        ? `${totalActualWeight.toFixed(2)} kg`
                        : '—'}
                    </div>
                    <div className="p-1.5">
                      {totalChargedWeight > 0
                        ? `${totalChargedWeight.toFixed(2)} kg`
                        : '—'}
                    </div>
                  </div>
                )}
              </div>

              {/* Charges Table - Right 30% */}
              <div className="w-[30%] flex flex-col">
                <div className="p-1.5 border-b-2 border-black font-bold text-center text-xs uppercase bg-gray-100 print:bg-transparent text-black">
                  Amount (₹)
                </div>
                <div className="flex-grow flex flex-col text-xs text-black">
                  <div className="flex justify-between p-1.5 border-b border-dashed border-black">
                    <span className="font-semibold">Freight Charges</span>
                    <span>{freight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-dashed border-black">
                    <span className="font-semibold">Labour Charges</span>
                    <span>{labour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-dashed border-black">
                    <span className="font-semibold">Statistical Fee</span>
                    <span>{statistical.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-black">
                    <span className="font-semibold">GST ({gstPct}%)</span>
                    <span>{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-2 font-bold text-sm bg-gray-100 print:bg-transparent flex-grow items-center text-black">
                    <span>GRAND TOTAL</span>
                    <span className="font-mono text-base font-black">
                      ₹{formData.totalAmount || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="p-2.5 border-b-2 border-black min-h-[50px]">
              <span className="font-bold underline uppercase text-xs text-black">
                Remarks / Instructions:
              </span>
              <p className="mt-0.5 text-xs whitespace-pre-line text-gray-800">
                {formData.remarks || 'None'}
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="grid grid-cols-3 pt-8 pb-3 text-center mt-auto">
              <div>
                <div className="border-t border-black mx-4 inline-block px-4 font-semibold text-xs uppercase text-black">
                  Consignor Signature
                </div>
              </div>
              <div>
                <div className="border-t border-black mx-4 inline-block px-4 font-semibold text-xs uppercase text-black">
                  Consignee Signature
                </div>
              </div>
              <div>
                <div className="border-t border-black mx-4 inline-block px-4 font-semibold text-xs uppercase text-black">
                  For A&amp;A Logistics
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-600 mt-1 italic print:text-black">
              * Subject to Mumbai jurisdiction only. Computer-generated official consignment receipt.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLLR;
