import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  isValidEmail,
  sanitizeEmail,
  sanitizeInputValue,
  validateSafePayload,
} from '@/lib/security/input';

interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

interface SelectedAddOn {
  name: string;
  price: number;
  count: number;
}

interface SelectedPackage {
  name: string;
  price: string;
  description: string;
}

interface BookingEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressUnit?: string;
  city: string;
  state: string;
  infoZipCode: string;
  zipCode: string;
  selectedYear: string;
  selectedMake: string;
  selectedModel: string;
  selectedBody: string;
  selectedCategory: string;
  selectedVehicleType: string;
  selectedPackage: SelectedPackage;
  selectedAddOns: SelectedAddOn[] | Record<string, number>;
  selectedConditions: string[];
  otherCondition: string;
  addOnsTotal: string;
  selectedDate: string;
  selectedArrivalWindows: string[];
  backupDate: string | null;
  waterAccess: 'yes' | 'no' | null;
  electricity: 'yes' | 'no' | null;
  coveredArea: 'yes' | 'no' | null;
  extraInfo: string;
  vehicleCount: number;
  marketingOptIn: boolean;
  totalPrice: string;
  bookingType: string;
  timestamp: string;
}

interface FormattedAddOn {
  name: string;
  price: string;
  count: number;
  total: string;
}

const addOnOptions: AddOnOption[] = [
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 70 },
  { id: 'super-interior', name: 'Super Interior', price: 140 },
  { id: 'interior-sanitizing', name: 'Interior Sanitizing', price: 60 },
  { id: 'rain-x', name: 'Rain X Treatment', price: 30 },
  { id: 'polymer-sealant', name: 'Polymer Sealant', price: 35 },
  { id: 'headlight-restoration', name: 'Headlight Restoration', price: 105 },
  { id: 'child-seat', name: 'Child Seat Cleaning', price: 35 },
];

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(value: number): string {
  return `$${value.toFixed(0)}`;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not specified';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not specified';

  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return safeDate.toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getBookingReference(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return safeDate.getTime().toString().slice(-8);
}

function formatBooleanChoice(value: string | null): string {
  if (!value) return 'Not specified';
  return value === 'yes' ? 'Yes' : 'No';
}

function cleanName(firstName: string, lastName: string): { firstName: string; lastName: string } {
  let firstNameClean = (firstName || '').trim();
  let lastNameClean = (lastName || '').trim();

  if (firstNameClean.toLowerCase().startsWith('name')) {
    firstNameClean = firstNameClean.substring(4).trim().replace(/^[: ]+/, '');
  }

  if (firstNameClean.includes(' ')) {
    const parts = firstNameClean.split(/\s+/);
    firstNameClean = parts[0] || '';
    const remaining = parts.slice(1).join(' ');
    lastNameClean = lastNameClean ? `${remaining} ${lastNameClean}`.trim() : remaining;
  }

  return { firstName: firstNameClean, lastName: lastNameClean };
}

function formatAddOns(addOns: SelectedAddOn[] | Record<string, number>): FormattedAddOn[] {
  if (Array.isArray(addOns)) {
    return addOns
      .filter((addOn) => addOn && addOn.name)
      .map((addOn) => {
        const count = Math.max(1, Number(addOn.count || 1));
        const price = Number(addOn.price || 0);

        return {
          name: addOn.name,
          price: formatMoney(price),
          count,
          total: formatMoney(price * count),
        };
      });
  }

  if (!addOns || typeof addOns !== 'object') return [];

  return Object.entries(addOns)
    .filter(([, count]) => Number(count) > 0)
    .map(([id, count]) => {
      const matchingAddOn = addOnOptions.find((addOn) => addOn.id === id);
      const safeCount = Math.max(1, Number(count || 1));
      const price = matchingAddOn?.price || 0;

      return {
        name: matchingAddOn?.name || id,
        price: matchingAddOn ? formatMoney(price) : 'N/A',
        count: safeCount,
        total: matchingAddOn ? formatMoney(price * safeCount) : 'N/A',
      };
    });
}

interface TemplateParams {
  cleanedName: { firstName: string; lastName: string };
  safeEmail: string;
  phone: string;
  fullAddress: string;
  zipCode: string;
  infoZipCode: string;
  state: string;
  vehicleName: string;
  selectedYear: string;
  selectedMake: string;
  selectedModel: string;
  selectedBody: string;
  selectedCategory: string;
  selectedVehicleType: string;
  vehicleCount: number;
  selectedPackage: SelectedPackage;
  formattedAddOns: FormattedAddOn[];
  addOnsHtml: string;
  addOnsSummaryText: string;
  addOnsTotal: string;
  selectedConditions: string[];
  conditionsHtml: string;
  otherCondition: string;
  formattedDate: string;
  formattedBackupDate: string;
  backupDate: string | null;
  selectedArrivalWindows: string[];
  waterAccess: 'yes' | 'no' | null;
  electricity: 'yes' | 'no' | null;
  coveredArea: 'yes' | 'no' | null;
  extraInfo: string;
  marketingOptIn: boolean;
  totalPrice: string;
  bookingType: string;
  bookingReference: string;
  formattedTimestamp: string;
}

function generateAdminEmailHtml(params: TemplateParams): string {
  const {
    cleanedName,
    safeEmail,
    phone,
    fullAddress,
    zipCode,
    infoZipCode,
    state,
    vehicleName,
    selectedYear,
    selectedMake,
    selectedModel,
    selectedBody,
    selectedCategory,
    selectedVehicleType,
    vehicleCount,
    selectedPackage,
    addOnsHtml,
    addOnsSummaryText,
    addOnsTotal,
    conditionsHtml,
    otherCondition,
    formattedDate,
    formattedBackupDate,
    backupDate,
    selectedArrivalWindows,
    waterAccess,
    electricity,
    coveredArea,
    extraInfo,
    marketingOptIn,
    totalPrice,
    bookingType,
    bookingReference,
    formattedTimestamp,
  } = params;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Mobile Detailing Booking</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f4f6f9;
          padding: 20px;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #1a3a6b, #2d5a9e);
          padding: 28px 36px;
          text-align: center;
          border-bottom: 3px solid #4a7bc4;
        }
        .header h1 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .header p {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          margin: 0;
        }
        .badge {
          display: inline-block;
          background: #d97706;
          color: white;
          padding: 3px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-mobile {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 3px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 6px;
          margin-left: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .content { padding: 28px 36px; }
        .section { margin-bottom: 24px; }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #1a3a6b;
          border-bottom: 2px solid #e8edf5;
          padding-bottom: 8px;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }
        .section-title .icon {
          color: #94a3b8;
          margin-right: 8px;
          font-size: 16px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 24px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .row-full { grid-column: 1 / -1; }
        .label {
          color: #94a3b8;
          font-size: 13px;
          padding-right: 16px;
        }
        .value {
          color: #1e293b;
          font-weight: 500;
          font-size: 13px;
          text-align: right;
        }
        .value-highlight {
          color: #1a3a6b;
          font-weight: 700;
        }
        .addon-tag {
          display: inline-block;
          background: #eef2ff;
          color: #4a7bc4;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          margin: 2px 4px 2px 0;
        }
        .condition-tag {
          display: inline-block;
          background: #fef2f2;
          color: #dc2626;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          margin: 2px 4px 2px 0;
        }
        .highlight {
          background: #dbeafe;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .total-box {
          background: #f8fafc;
          border-radius: 10px;
          padding: 16px 20px;
          margin-top: 6px;
          border: 1px solid #e2e8f0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }
        .total-amount {
          font-size: 24px;
          font-weight: 800;
          color: #1a3a6b;
        }
        .note-box {
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 0;
          border-left: 3px solid #4a7bc4;
        }
        .reference-box {
          margin-top: 16px;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .footer {
          background: #f8fafc;
          padding: 16px 36px;
          text-align: center;
          border-top: 1px solid #e8edf5;
        }
        .footer p {
          color: #94a3b8;
          font-size: 12px;
          margin: 3px 0;
        }
        @media (max-width: 600px) {
          .header { padding: 20px; }
          .content { padding: 16px 20px; }
          .grid { grid-template-columns: 1fr; }
          .total-amount { font-size: 20px; }
          .row { flex-direction: column; align-items: flex-start; gap: 2px; }
          .value { text-align: left; }
          .badge-mobile { margin-left: 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Mobile Detailing Booking</h1>
          <p>${escapeHtml(formattedTimestamp)}</p>
          <div>
            <span class="badge">Pending Confirmation</span>
            <span class="badge-mobile">${escapeHtml(bookingType || 'Mobile Detailing')}</span>
          </div>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Customer Information
            </div>
            <div class="grid">
              <div class="row">
                <span class="label">Name</span>
                <span class="value">${escapeHtml(`${cleanedName.firstName} ${cleanedName.lastName}`.trim())}</span>
              </div>
              <div class="row">
                <span class="label">Email</span>
                <span class="value">${escapeHtml(safeEmail)}</span>
              </div>
              <div class="row">
                <span class="label">Phone</span>
                <span class="value">${escapeHtml(phone)}</span>
              </div>
              <div class="row row-full">
                <span class="label">Address</span>
                <span class="value">${escapeHtml(fullAddress || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Service Area Postcode</span>
                <span class="value"><span class="highlight">${escapeHtml(zipCode || 'Not specified')}</span></span>
              </div>
              <div class="row">
                <span class="label">Detailing Postcode</span>
                <span class="value"><span class="highlight">${escapeHtml(infoZipCode || 'Not specified')}</span></span>
              </div>
              <div class="row">
                <span class="label">State</span>
                <span class="value">${escapeHtml(state || 'Not specified')}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Vehicle Details
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Vehicle</span>
                <span class="value value-highlight">${escapeHtml(vehicleName || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Year</span>
                <span class="value">${escapeHtml(selectedYear || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Make</span>
                <span class="value">${escapeHtml(selectedMake || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Model</span>
                <span class="value">${escapeHtml(selectedModel || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Body Type</span>
                <span class="value">${escapeHtml(selectedBody || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Category</span>
                <span class="value"><span class="highlight">${escapeHtml(selectedCategory || 'Mobile')}</span></span>
              </div>
              <div class="row">
                <span class="label">Vehicle Type</span>
                <span class="value">${escapeHtml(selectedVehicleType || 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Number of Vehicles</span>
                <span class="value">${escapeHtml(vehicleCount || 1)}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Selected Package
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Package</span>
                <span class="value value-highlight">${escapeHtml(selectedPackage?.name || 'Not selected')}</span>
              </div>
              <div class="row">
                <span class="label">Package Price</span>
                <span class="value value-highlight">${escapeHtml(selectedPackage?.price || '$0')}</span>
              </div>
              <div class="row row-full">
                <span class="label">Description</span>
                <span class="value">${escapeHtml(selectedPackage?.description || 'Not specified')}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Add-ons
            </div>
            <div style="margin-bottom: 8px;">
              ${addOnsHtml}
            </div>
            <div class="row">
              <span class="label">Add-ons Summary</span>
              <span class="value">${escapeHtml(addOnsSummaryText)}</span>
            </div>
            ${addOnsTotal ? `
              <div class="row">
                <span class="label">Add-ons Total</span>
                <span class="value value-highlight">${escapeHtml(addOnsTotal)}</span>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Vehicle Conditions
            </div>
            <div style="margin-bottom: 8px;">
              ${conditionsHtml}
              ${otherCondition ? `<span class="condition-tag">Other: ${escapeHtml(otherCondition)}</span>` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon">◈</span> Appointment Details
            </div>
            <div class="grid">
              <div class="row">
                <span class="label">Primary Date</span>
                <span class="value value-highlight">${escapeHtml(formattedDate)}</span>
              </div>
              ${backupDate ? `
                <div class="row">
                  <span class="label">Backup Date</span>
                  <span class="value">${escapeHtml(formattedBackupDate)}</span>
                </div>
              ` : ''}
              <div class="row row-full">
                <span class="label">Arrival Window</span>
                <span class="value">${escapeHtml(selectedArrivalWindows?.length ? selectedArrivalWindows.join(', ') : 'Not specified')}</span>
              </div>
              <div class="row">
                <span class="label">Water Access</span>
                <span class="value">${escapeHtml(formatBooleanChoice(waterAccess))}</span>
              </div>
              <div class="row">
                <span class="label">Electricity</span>
                <span class="value">${escapeHtml(formatBooleanChoice(electricity))}</span>
              </div>
              <div class="row">
                <span class="label">Covered Area</span>
                <span class="value">${escapeHtml(formatBooleanChoice(coveredArea))}</span>
              </div>
              <div class="row">
                <span class="label">Marketing Opt-in</span>
                <span class="value">${marketingOptIn ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          ${extraInfo ? `
            <div class="section">
              <div class="section-title">
                <span class="icon">◈</span> Extra Information
              </div>
              <p class="note-box">${escapeHtml(extraInfo)}</p>
            </div>
          ` : ''}

          <div class="section">
            <div class="total-box">
              <div class="total-row">
                <span class="total-label">Total Amount</span>
                <span class="total-amount">${escapeHtml(totalPrice || '$0')}</span>
              </div>
              <div style="margin-top: 6px; text-align: right; font-size: 11px; color: #94a3b8;">
                Includes package + add-ons (${escapeHtml(vehicleCount || 1)} vehicle${(vehicleCount || 1) > 1 ? 's' : ''})
              </div>
            </div>
          </div>

          <div class="section reference-box">
            <div class="section-title" style="margin-bottom: 8px; font-size: 12px; border-bottom: none; padding-bottom: 4px;">
              <span class="icon">◈</span> Additional Information
            </div>
            <div class="grid">
              <div class="row">
                <span class="label">Booking Type</span>
                <span class="value">${escapeHtml(bookingType || 'Mobile Detailing')}</span>
              </div>
              <div class="row">
                <span class="label">Booking Reference</span>
                <span class="value" style="font-size: 11px; color: #64748b;">${escapeHtml(bookingReference)}</span>
              </div>
              <div class="row">
                <span class="label">Submitted At</span>
                <span class="value">${escapeHtml(formattedTimestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p style="font-weight: 600; color: #64748b;">Shining Property Service</p>
          <p>This mobile detailing booking was submitted from the Shining Property Service website.</p>
          <p>© ${new Date().getFullYear()} Shining Property Service. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerEmailHtml(params: TemplateParams): string {
  const {
    cleanedName,
    fullAddress,
    vehicleName,
    selectedCategory,
    selectedBody,
    vehicleCount,
    selectedPackage,
    formattedAddOns,
    addOnsTotal,
    selectedConditions,
    otherCondition,
    formattedDate,
    formattedBackupDate,
    backupDate,
    selectedArrivalWindows,
    waterAccess,
    electricity,
    coveredArea,
    extraInfo,
    totalPrice,
    bookingReference,
    formattedTimestamp,
  } = params;

  const customerName = cleanedName.firstName || 'Valued Customer';
  const arrivalText = selectedArrivalWindows?.length ? selectedArrivalWindows.join(', ') : 'To be confirmed';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Shining Property Service</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f1f5f9;
          color: #1e293b;
          padding: 24px 12px;
          line-height: 1.5;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #0f2b5c 0%, #1e40af 100%);
          padding: 34px 32px;
          text-align: center;
          color: #ffffff;
        }
        .brand-subtitle {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 6px;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .header p {
          color: #dbeafe;
          font-size: 13px;
        }
        .badge-row {
          margin-top: 14px;
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.28);
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .badge-status {
          display: inline-block;
          background: #10b981;
          color: #ffffff;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .content {
          padding: 28px 32px;
        }
        .greeting {
          font-size: 15px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .greeting strong {
          color: #0f172a;
        }
        .card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 18px;
        }
        .card-header {
          display: flex;
          align-items: center;
          font-size: 13px;
          font-weight: 700;
          color: #1e3a8a;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-header .icon {
          margin-right: 8px;
          font-size: 15px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 20px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
        }
        .row:last-child {
          border-bottom: none;
        }
        .row-full {
          grid-column: 1 / -1;
        }
        .label {
          color: #64748b;
          font-size: 13px;
        }
        .val {
          color: #0f172a;
          font-weight: 600;
          text-align: right;
          font-size: 13px;
        }
        .val-highlight {
          color: #1e40af;
          font-weight: 700;
        }
        .tag {
          display: inline-block;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          margin: 2px 4px 4px 0;
        }
        .condition-tag {
          display: inline-block;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          margin: 2px 4px 4px 0;
        }
        .total-box {
          background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 18px 22px;
          margin-top: 6px;
          margin-bottom: 22px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 15px;
          font-weight: 700;
          color: #166534;
        }
        .total-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 3px;
        }
        .total-amount {
          font-size: 26px;
          font-weight: 800;
          color: #0f2b5c;
        }
        .checklist-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-left: 4px solid #f59e0b;
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 22px;
        }
        .checklist-title {
          font-size: 13px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .checklist-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .checklist-list li {
          font-size: 13px;
          color: #78350f;
          padding: 4px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .checklist-list li span.bullet {
          color: #d97706;
          font-weight: 700;
        }
        .support-box {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 16px 20px;
          text-align: center;
          font-size: 13px;
          color: #475569;
          margin-bottom: 20px;
        }
        .support-box a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .footer {
          background: #f8fafc;
          padding: 22px 32px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          color: #94a3b8;
          font-size: 12px;
          margin: 3px 0;
        }
        @media (max-width: 600px) {
          .header { padding: 24px 20px; }
          .content { padding: 20px 16px; }
          .grid { grid-template-columns: 1fr; }
          .row { flex-direction: column; align-items: flex-start; gap: 2px; }
          .val { text-align: left; }
          .total-amount { font-size: 22px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="brand-subtitle">Shining Property Service</div>
          <h1>Booking Confirmation</h1>
          <p>Thank you for choosing our Mobile Vehicle Detailing service</p>
          <div class="badge-row">
            <span class="badge">Ref: #${escapeHtml(bookingReference)}</span>
            <span class="badge-status">Booking Received</span>
          </div>
        </div>

        <div class="content">
          <!-- Personalized Greeting -->
          <div class="greeting">
            Dear <strong>${escapeHtml(customerName)}</strong>,<br><br>
            We have successfully received your mobile detailing booking request! Our professional detailing team is preparing for your appointment. Below is a complete summary of your requested service details:
          </div>

          <!-- Schedule Details Card -->
          <div class="card">
            <div class="card-header">
              <span class="icon">📅</span> Appointment Schedule
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Service Date</span>
                <span class="val val-highlight">${escapeHtml(formattedDate)}</span>
              </div>
              <div class="row row-full">
                <span class="label">Arrival Window</span>
                <span class="val val-highlight">${escapeHtml(arrivalText)}</span>
              </div>
              ${backupDate ? `
                <div class="row row-full">
                  <span class="label">Backup Date Preference</span>
                  <span class="val">${escapeHtml(formattedBackupDate)}</span>
                </div>
              ` : ''}
              <div class="row row-full">
                <span class="label">Booking Submitted</span>
                <span class="val">${escapeHtml(formattedTimestamp)}</span>
              </div>
            </div>
          </div>

          <!-- Service Location Card -->
          <div class="card">
            <div class="card-header">
              <span class="icon">📍</span> Service Location & Site Details
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Service Address</span>
                <span class="val">${escapeHtml(fullAddress || 'Address on file')}</span>
              </div>
              <div class="row">
                <span class="label">Water Access</span>
                <span class="val">${escapeHtml(formatBooleanChoice(waterAccess))}</span>
              </div>
              <div class="row">
                <span class="label">Electricity Access</span>
                <span class="val">${escapeHtml(formatBooleanChoice(electricity))}</span>
              </div>
              <div class="row row-full">
                <span class="label">Covered Workspace</span>
                <span class="val">${escapeHtml(formatBooleanChoice(coveredArea))}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Details Card -->
          <div class="card">
            <div class="card-header">
              <span class="icon">🚗</span> Vehicle Details
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Vehicle</span>
                <span class="val val-highlight">${escapeHtml(vehicleName || 'Vehicle')}</span>
              </div>
              <div class="row">
                <span class="label">Category</span>
                <span class="val">${escapeHtml(selectedCategory || 'Mobile')}</span>
              </div>
              <div class="row">
                <span class="label">Body Type</span>
                <span class="val">${escapeHtml(selectedBody || 'Standard')}</span>
              </div>
              <div class="row row-full">
                <span class="label">Vehicles Booked</span>
                <span class="val">${escapeHtml(vehicleCount || 1)}</span>
              </div>
            </div>
          </div>

          <!-- Selected Package & Add-ons Card -->
          <div class="card">
            <div class="card-header">
              <span class="icon">✨</span> Service Package & Add-Ons
            </div>
            <div class="grid">
              <div class="row row-full">
                <span class="label">Selected Package</span>
                <span class="val val-highlight">${escapeHtml(selectedPackage?.name || 'Mobile Detailing')}</span>
              </div>
              <div class="row row-full">
                <span class="label">Package Base Price</span>
                <span class="val">${escapeHtml(selectedPackage?.price || '$0')}</span>
              </div>
              ${selectedPackage?.description ? `
                <div class="row row-full" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                  <span class="label">Inclusions</span>
                  <span class="val" style="text-align: left; font-weight: normal; color: #475569; font-size: 12px; line-height: 1.5;">
                    ${escapeHtml(selectedPackage.description)}
                  </span>
                </div>
              ` : ''}
            </div>

            <!-- Add-ons itemized -->
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
              <span class="label" style="display: block; margin-bottom: 6px;">Selected Add-Ons:</span>
              ${formattedAddOns.length > 0 ? `
                <div style="margin-bottom: 6px;">
                  ${formattedAddOns
                    .map((addOn) => `<span class="tag">${escapeHtml(addOn.name)} x ${addOn.count} (${escapeHtml(addOn.total)})</span>`)
                    .join(' ')}
                </div>
                <div class="row">
                  <span class="label">Add-Ons Subtotal</span>
                  <span class="val">${escapeHtml(addOnsTotal || '$0')}</span>
                </div>
              ` : '<span style="color: #94a3b8; font-size: 13px;">None selected</span>'}
            </div>

            <!-- Vehicle conditions if any -->
            ${(selectedConditions?.length || otherCondition) ? `
              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
                <span class="label" style="display: block; margin-bottom: 6px;">Noted Vehicle Conditions:</span>
                <div>
                  ${(selectedConditions || []).map((c: string) => `<span class="condition-tag">${escapeHtml(c)}</span>`).join(' ')}
                  ${otherCondition ? `<span class="condition-tag">Other: ${escapeHtml(otherCondition)}</span>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Extra Notes if any -->
          ${extraInfo ? `
            <div class="card">
              <div class="card-header">
                <span class="icon">📝</span> Special Instructions / Notes
              </div>
              <p style="font-size: 13px; color: #475569; line-height: 1.5;">${escapeHtml(extraInfo)}</p>
            </div>
          ` : ''}

          <!-- Total Price Card -->
          <div class="total-box">
            <div class="total-row">
              <div>
                <div class="total-label">Total Estimated Price</div>
                <div class="total-sub">Includes package + add-ons for ${escapeHtml(vehicleCount || 1)} vehicle${(vehicleCount || 1) > 1 ? 's' : ''}</div>
              </div>
              <div class="total-amount">${escapeHtml(totalPrice || '$0')}</div>
            </div>
          </div>

          <!-- Customer Preparation Checklist -->
          <div class="checklist-box">
            <div class="checklist-title">💡 What to Prepare Before We Arrive</div>
            <ul class="checklist-list">
              <li>
                <span class="bullet">✔</span>
                <span><strong>Vehicle Accessibility:</strong> Please ensure your vehicle is parked in an accessible spot with sufficient space around all doors.</span>
              </li>
              <li>
                <span class="bullet">✔</span>
                <span><strong>Personal Items:</strong> Please remove valuable personal belongings from the vehicle interior beforehand.</span>
              </li>
              <li>
                <span class="bullet">✔</span>
                <span><strong>Detailing Specialist Arrival:</strong> Our specialist will call or text you with an ETA when heading to your location within the arrival window.</span>
              </li>
            </ul>
          </div>

          <!-- Support & Changes Box -->
          <div class="support-box">
            <strong>Need to reschedule or make changes?</strong><br>
            Feel free to reply directly to this email or contact us at <a href="mailto:shiningpropertyofficial@gmail.com">shiningpropertyofficial@gmail.com</a> with reference <strong>#${escapeHtml(bookingReference)}</strong>.
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="font-weight: 700; color: #475569; font-size: 13px;">Shining Property Service</p>
          <p>Premier Mobile Vehicle Detailing & Property Care</p>
          <p>© ${new Date().getFullYear()} Shining Property Service. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const unsafeBody = (await request.json()) as BookingEmailData;
    const unsafeMessage = validateSafePayload(unsafeBody, 'Booking');

    if (unsafeMessage) {
      return NextResponse.json({ success: false, error: unsafeMessage }, { status: 400 });
    }

    const body = sanitizeInputValue(unsafeBody) as BookingEmailData;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      addressUnit,
      city,
      state,
      infoZipCode,
      selectedYear,
      selectedMake,
      selectedModel,
      selectedBody,
      selectedCategory,
      selectedVehicleType,
      selectedPackage,
      selectedAddOns,
      selectedConditions,
      otherCondition,
      selectedDate,
      selectedArrivalWindows,
      waterAccess,
      electricity,
      coveredArea,
      extraInfo,
      vehicleCount,
      marketingOptIn,
      zipCode,
      totalPrice,
      bookingType,
      timestamp,
      addOnsTotal,
      backupDate,
    } = body;

    const safeEmail = sanitizeEmail(email || '');

    if (!isValidEmail(safeEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanedName = cleanName(firstName, lastName);
    const formattedAddOns = formatAddOns(selectedAddOns || []);
    const formattedTimestamp = formatDateTime(timestamp);
    const formattedDate = formatDate(selectedDate);
    const formattedBackupDate = formatDate(backupDate);
    const bookingReference = getBookingReference(timestamp);
    const fullAddress = [address, addressUnit, city, state, infoZipCode].filter(Boolean).join(', ');
    const vehicleName = [selectedYear, selectedMake, selectedModel, selectedBody].filter(Boolean).join(' ');

    const addOnsHtml = formattedAddOns.length > 0
      ? formattedAddOns
        .map((addOn) => `<span class="addon-tag">${escapeHtml(addOn.name)} x ${addOn.count} (${escapeHtml(addOn.total)})</span>`)
        .join(' ')
      : '<span style="color: #94a3b8;">None selected</span>';

    const addOnsSummaryText = formattedAddOns.length > 0
      ? formattedAddOns.map((addOn) => `${addOn.name} x ${addOn.count}`).join(', ')
      : 'None';

    const conditionsHtml = selectedConditions?.length
      ? selectedConditions
        .map((condition) => `<span class="condition-tag">${escapeHtml(condition)}</span>`)
        .join(' ')
      : '<span style="color: #94a3b8;">None selected</span>';

    const templateParams: TemplateParams = {
      cleanedName,
      safeEmail,
      phone,
      fullAddress,
      zipCode,
      infoZipCode,
      state,
      vehicleName,
      selectedYear,
      selectedMake,
      selectedModel,
      selectedBody,
      selectedCategory,
      selectedVehicleType,
      vehicleCount,
      selectedPackage,
      formattedAddOns,
      addOnsHtml,
      addOnsSummaryText,
      addOnsTotal,
      selectedConditions: selectedConditions || [],
      conditionsHtml,
      otherCondition,
      formattedDate,
      formattedBackupDate,
      backupDate,
      selectedArrivalWindows,
      waterAccess,
      electricity,
      coveredArea,
      extraInfo,
      marketingOptIn,
      totalPrice,
      bookingType,
      bookingReference,
      formattedTimestamp,
    };

    const adminHtml = generateAdminEmailHtml(templateParams);
    const customerHtml = generateCustomerEmailHtml(templateParams);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const adminMailOptions = {
      from: `"Shining Property Service" <${process.env.GMAIL_USER}>`,
      to: 'shiningpropertyofficial@gmail.com',
      subject: `New Mobile Detailing Booking: ${selectedPackage?.name || 'Booking'} - ${cleanedName.firstName} ${cleanedName.lastName}`,
      html: adminHtml,
      replyTo: safeEmail,
    };

    const customerMailOptions = {
      from: `"Shining Property Service" <${process.env.GMAIL_USER}>`,
      to: safeEmail,
      subject: `Booking Confirmation: Mobile Detailing Service #${bookingReference} - Shining Property Service`,
      html: customerHtml,
      replyTo: process.env.GMAIL_USER || 'shiningpropertyofficial@gmail.com',
    };

    // Dispatch both customer confirmation and admin notification concurrently
    const [adminResult, customerResult] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    if (customerResult.status === 'rejected') {
      console.error('[send-mobile-booking-email] Failed to send customer confirmation email:', customerResult.reason);
    }
    if (adminResult.status === 'rejected') {
      console.error('[send-mobile-booking-email] Failed to send admin notification email:', adminResult.reason);
    }

    // If both failed, notify client of failure
    if (customerResult.status === 'rejected' && adminResult.status === 'rejected') {
      throw new Error('Failed to send booking emails. Please try again or contact us directly.');
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed and confirmation email sent successfully.',
      bookingReference,
      customerEmail: safeEmail,
      status: {
        customerEmail: customerResult.status === 'fulfilled' ? 'sent' : 'failed',
        adminEmail: adminResult.status === 'fulfilled' ? 'sent' : 'failed',
      },
    });
  } catch (error) {
    console.error('Error sending mobile detailing email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send booking email',
      },
      { status: 500 }
    );
  }
}
