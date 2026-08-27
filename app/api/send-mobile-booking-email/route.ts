// app/api/send-booking-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ============================================
// TYPES
// ============================================

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

// ============================================
// ADD-ON OPTIONS (for reference)
// ============================================

const addOnOptions: AddOnOption[] = [
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 70 },
  { id: 'super-interior', name: 'Super Interior', price: 140 },
  { id: 'interior-sanitizing', name: 'Interior Sanitizing', price: 60 },
  { id: 'rain-x', name: 'Rain X Treatment', price: 30 },
  { id: 'polymer-sealant', name: 'Polymer Sealant', price: 35 },
  { id: 'headlight-restoration', name: 'Headlight Restoration', price: 105 },
  { id: 'child-seat', name: 'Child Seat Cleaning', price: 35 },
];

// ============================================
// HELPERS
// ============================================

function formatAddons(addons: SelectedAddOn[] | Record<string, number>): { list: string; items: string[] } {
  const items: string[] = [];
  
  if (Array.isArray(addons)) {
    // Handle array format
    addons.forEach((addon: SelectedAddOn) => {
      if (addon && typeof addon === 'object' && addon.name) {
        const count = addon.count || 1;
        items.push(`${addon.name} × ${count} ($${(addon.price || 0) * count})`);
      }
    });
  } else if (addons && typeof addons === 'object') {
    // Handle record format { id: count }
    Object.entries(addons).forEach(([id, count]) => {
      if (count > 0) {
        const addon = addOnOptions.find(a => a.id === id);
        if (addon) {
          items.push(`${addon.name} × ${count} ($${addon.price * count})`);
        } else {
          items.push(`${id} × ${count}`);
        }
      }
    });
  }
  
  return {
    list: items.length > 0 ? items.join(', ') : 'None',
    items,
  };
}

// ============================================
// POST HANDLER
// ============================================

export async function POST(request: Request) {
  try {
    const body: BookingEmailData = await request.json();
    
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

    // Format selected add-ons
    const { list: addonsList, items: addonItems } = formatAddons(selectedAddOns || []);

    // Format full address
    const fullAddress = [address, addressUnit, city, state, infoZipCode]
      .filter(Boolean)
      .join(', ');

    // Format date
    const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Format backup date
    const formattedBackupDate = backupDate ? new Date(backupDate).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Format timestamp
    const formattedTimestamp = timestamp ? new Date(timestamp).toLocaleString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : new Date().toLocaleString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build add-ons HTML
    const addonsHtml = addonItems.length > 0 
      ? addonItems.map((item: string) => `<span class="addon-tag">${item}</span>`).join('')
      : '<span style="color: #94a3b8; font-size: 13px;">No add-ons selected</span>';

    // Build conditions HTML
    const conditionsHtml = selectedConditions && selectedConditions.length > 0
      ? selectedConditions.map((c: string) => `<span class="condition-tag">${c}</span>`).join(' ')
      : '';

    // ============================================
    // BUILD EMAIL HTML
    // ============================================

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Mobile Detailing Booking</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding: 20px; }
          .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #1a3a6b, #2d5a9e); padding: 28px 36px; text-align: center; border-bottom: 3px solid #4a7bc4; }
          .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0; }
          .badge { display: inline-block; background: #d97706; color: white; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
          .badge-mobile { display: inline-block; background: #2563eb; color: white; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 6px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { padding: 28px 36px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 14px; font-weight: 700; color: #1a3a6b; border-bottom: 2px solid #e8edf5; padding-bottom: 8px; margin-bottom: 14px; letter-spacing: 0.3px; }
          .section-title .icon { color: #94a3b8; margin-right: 8px; font-size: 16px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }
          .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f1f5f9; }
          .row-full { grid-column: 1 / -1; }
          .label { color: #94a3b8; font-size: 13px; }
          .value { color: #1e293b; font-weight: 500; font-size: 13px; }
          .value-highlight { color: #1a3a6b; font-weight: 700; }
          .addon-tag { display: inline-block; background: #eef2ff; color: #4a7bc4; padding: 2px 10px; border-radius: 10px; font-size: 11px; margin: 2px 4px 2px 0; }
          .condition-tag { display: inline-block; background: #fef2f2; color: #dc2626; padding: 2px 10px; border-radius: 10px; font-size: 11px; margin: 2px 4px 2px 0; }
          .total-box { background: #f8fafc; border-radius: 10px; padding: 16px 20px; margin-top: 6px; border: 1px solid #e2e8f0; }
          .total-row { display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 16px; font-weight: 600; color: #1e293b; }
          .total-amount { font-size: 24px; font-weight: 800; color: #1a3a6b; }
          .zip-highlight { background: #dbeafe; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
          .footer { background: #f8fafc; padding: 16px 36px; text-align: center; border-top: 1px solid #e8edf5; }
          .footer p { color: #94a3b8; font-size: 12px; margin: 3px 0; }
          @media (max-width: 600px) {
            .header { padding: 20px; }
            .content { padding: 16px 20px; }
            .grid { grid-template-columns: 1fr; }
            .total-amount { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>✦ New Mobile Detailing Booking</h1>
            <p>${formattedTimestamp}</p>
            <div>
              <span class="badge">● Pending Confirmation</span>
              <span class="badge-mobile">${bookingType || 'Mobile Detailing'}</span>
            </div>
          </div>

          <div class="content">
            <!-- Customer Information -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Customer Information</div>
              <div class="grid">
                <div class="row">
                  <span class="label">Name</span>
                  <span class="value">${firstName || ''} ${lastName || ''}</span>
                </div>
                <div class="row">
                  <span class="label">Email</span>
                  <span class="value">${email || ''}</span>
                </div>
                <div class="row">
                  <span class="label">Phone</span>
                  <span class="value">${phone || ''}</span>
                </div>
                <div class="row row-full">
                  <span class="label">Address</span>
                  <span class="value">${fullAddress || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Postcode (Service Area)</span>
                  <span class="value"><span class="zip-highlight">${zipCode || 'Not specified'}</span></span>
                </div>
                <div class="row">
                  <span class="label">Postcode (Delivery)</span>
                  <span class="value"><span class="zip-highlight">${infoZipCode || 'Not specified'}</span></span>
                </div>
                <div class="row">
                  <span class="label">State</span>
                  <span class="value">${state || 'Not specified'}</span>
                </div>
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Vehicle Details</div>
              <div class="grid">
                <div class="row">
                  <span class="label">Year</span>
                  <span class="value">${selectedYear || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Make</span>
                  <span class="value">${selectedMake || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Model</span>
                  <span class="value">${selectedModel || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Body Type</span>
                  <span class="value">${selectedBody || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Category</span>
                  <span class="value">${selectedCategory || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Number of Vehicles</span>
                  <span class="value">${vehicleCount || 1}</span>
                </div>
              </div>
            </div>

            <!-- Package -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Selected Package</div>
              <div class="grid">
                <div class="row row-full">
                  <span class="label">Package</span>
                  <span class="value value-highlight">${selectedPackage?.name || 'Not selected'}</span>
                </div>
                <div class="row">
                  <span class="label">Price</span>
                  <span class="value value-highlight">${selectedPackage?.price || '$0'}</span>
                </div>
                <div class="row row-full">
                  <span class="label">Description</span>
                  <span class="value">${selectedPackage?.description || ''}</span>
                </div>
              </div>
            </div>

            <!-- Add-ons -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Add-ons</div>
              <div>
                ${addonsHtml}
              </div>
              ${addOnsTotal ? `<div style="margin-top: 8px; text-align: right; font-size: 13px; color: #1a3a6b; font-weight: 600;">Add-ons Total: ${addOnsTotal}</div>` : ''}
            </div>

            <!-- Vehicle Conditions -->
            ${selectedConditions && selectedConditions.length > 0 ? `
              <div class="section">
                <div class="section-title"><span class="icon">◈</span> Vehicle Conditions</div>
                <div>
                  ${conditionsHtml}
                  ${otherCondition ? `<span class="condition-tag">Other: ${otherCondition}</span>` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Appointment -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Appointment Details</div>
              <div class="grid">
                <div class="row">
                  <span class="label">Primary Date</span>
                  <span class="value">${formattedDate}</span>
                </div>
                ${backupDate ? `
                  <div class="row">
                    <span class="label">Backup Date</span>
                    <span class="value">${formattedBackupDate}</span>
                  </div>
                ` : ''}
                <div class="row">
                  <span class="label">Arrival Window</span>
                  <span class="value">${selectedArrivalWindows?.length > 0 ? selectedArrivalWindows.join(', ') : 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Water Access</span>
                  <span class="value">${waterAccess || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Electricity</span>
                  <span class="value">${electricity || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Covered Area</span>
                  <span class="value">${coveredArea || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Marketing Opt-in</span>
                  <span class="value">${marketingOptIn ? '✦ Yes' : '○ No'}</span>
                </div>
              </div>
            </div>

            <!-- Extra Info -->
            ${extraInfo ? `
              <div class="section">
                <div class="section-title"><span class="icon">◈</span> Extra Information</div>
                <p style="color: #475569; font-size: 13px; line-height: 1.6; background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin: 0; border-left: 3px solid #4a7bc4;">
                  ${extraInfo}
                </p>
              </div>
            ` : ''}

            <!-- Total -->
            <div class="section">
              <div class="total-box">
                <div class="total-row">
                  <span class="total-label">Total Amount</span>
                  <span class="total-amount">${totalPrice || '$0'}</span>
                </div>
                <div style="margin-top: 6px; text-align: right; font-size: 11px; color: #94a3b8;">
                  Includes package + add-ons (${vehicleCount || 1} vehicle${(vehicleCount || 1) > 1 ? 's' : ''})
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: 600; color: #64748b;">Shining Property Service</p>
            <p>This mobile detailing booking was submitted from the Shining Property Service website.</p>
            <p>© ${new Date().getFullYear()} Shining Property Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ============================================
    // SEND EMAIL
    // ============================================

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Shining Property Service" <${process.env.GMAIL_USER}>`,
      to: 'shiningpropertyofficial@gmail.com',
      subject: `Mobile Detailing Booking: ${selectedPackage?.name || 'Booking'} - ${firstName || ''} ${lastName || ''}`,
      html: html,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Booking email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }, { status: 500 });
  }
}