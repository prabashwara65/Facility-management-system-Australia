import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  escapeHtml,
  isValidEmail,
  sanitizeEmail,
  sanitizeInputValue,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeText,
  validateSafePayload,
} from '@/lib/security/input';

// Add-ons data for reference (should match the frontend)
const addOnsData = [
  { id: '1', name: 'Carpet Steam Cleaning (Living Area/Hall)', price: '$100', description: 'Living Area/Hall', category: 'Carpet & Upholstery' },
  { id: '2', name: 'Carpet Steam Cleaning (Per Bedroom)', price: '$55', description: 'Per Bedroom', category: 'Carpet & Upholstery' },
  { id: '3', name: 'Upholstery Steam Cleaning', price: 'Custom', description: 'Available upon request', category: 'Carpet & Upholstery' },
  { id: '4', name: 'Oven Cleaning', price: '$65', description: 'Professional oven cleaning', category: 'Kitchen Add-ons' },
  { id: '5', name: 'Fridge Cleaning', price: '$35', description: 'Deep fridge cleaning', category: 'Kitchen Add-ons' },
  { id: '6', name: 'Dishes', price: '$35', description: 'Wash and put away dishes', category: 'Kitchen Add-ons' },
  { id: '7', name: 'Clean Inside Cabinets', price: '$30 - $100', description: 'Based on number of cabinets', category: 'Whole Home' },
  { id: '8', name: 'Inside Window Cleaning', price: '$65 - $150', description: 'Based on number of windows', category: 'Whole Home' },
  { id: '9', name: 'Wet Wipe Blinds', price: '$29', description: 'Per blind', category: 'Whole Home' },
  { id: '10', name: 'Clean Walls', price: '$29', description: 'Per wall', category: 'Whole Home' },
  { id: '11', name: 'Use Green Supplies', price: '$5', description: 'Eco-friendly cleaning products', category: 'Whole Home' },
  { id: '12', name: 'Bed Linen Change', price: '$15', description: 'Fresh bed linen', category: 'Deep Detail' },
  { id: '13', name: 'Ironing', price: '$45', description: 'Per 30 minutes', category: 'Deep Detail' },
  { id: '14', name: 'Laundry Service', price: '$30', description: 'Per load', category: 'Deep Detail' },
  { id: '15', name: 'Balcony / Patio Clean', price: '$60 - $100', description: 'Based on size', category: 'Deep Detail' },
  { id: '16', name: 'Garage Clean', price: '$50+', description: 'Starting from $50', category: 'Deep Detail' },
];

type AddOnInput = {
  name?: unknown;
  price?: unknown;
  category?: unknown;
};

type BookingDataInput = {
  selectedAddOns?: unknown;
};

function asString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const unsafeBody = await request.json();
    const unsafeMessage = validateSafePayload(unsafeBody, 'Booking');

    if (unsafeMessage) {
      return NextResponse.json({ success: false, error: unsafeMessage }, { status: 400 });
    }

    const body = sanitizeInputValue(unsafeBody) as Record<string, unknown>;
    
    const {
      // Customer Info
      firstName,
      lastName,
      email,
      phone,
      address,
      suburb,
      preferredDate,
      specialInstructions,
      
      // Booking Details
      serviceType,
      bedrooms,
      bathrooms,
      
      // Package Info
      packageName,
      packagePrice,
      
      // Add-ons
      addOns,
      addOnsTotal,
      
      // Total
      totalPrice,
      
      // Booking Type
      bookingType,
      
      // Timestamp
      timestamp,
      
      // Category
      category,
      
      // All raw booking data
      bookingData,
    } = body;

    // Clean and format names
    let firstNameClean = sanitizeText(asString(firstName), 80);
    let lastNameClean = sanitizeText(asString(lastName), 80);
    const safeEmail = sanitizeEmail(asString(email));
    const safePhone = sanitizePhone(asString(phone));
    const safeAddress = sanitizeText(asString(address), 180);
    const safeSuburb = sanitizeText(asString(suburb), 80);
    const safeSpecialInstructions = sanitizeMultilineText(asString(specialInstructions), 1000);

    if (!isValidEmail(safeEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Remove "Name" prefix if it exists
    if (firstNameClean.toLowerCase().startsWith('name')) {
      firstNameClean = firstNameClean.substring(4).trim();
      firstNameClean = firstNameClean.replace(/^[: ]+/, '');
    }

    // If firstName contains a space, split it
    if (firstNameClean.includes(' ')) {
      const parts = firstNameClean.split(' ');
      firstNameClean = parts[0];
      const remaining = parts.slice(1).join(' ');
      lastNameClean = lastNameClean ? `${remaining} ${lastNameClean}` : remaining;
    }

    // Format add-ons with proper names from IDs
    let formattedAddOns: { name: string; price: string; category: string }[] = [];
    
    // Check if addOns is an array of objects (from the frontend)
    if (addOns && Array.isArray(addOns) && addOns.length > 0) {
      formattedAddOns = addOns.map((addon: AddOnInput) => ({
        name: sanitizeText(asString(addon.name) || 'Unknown', 120),
        price: sanitizeText(asString(addon.price) || 'N/A', 40),
        category: sanitizeText(asString(addon.category) || 'General', 80),
      }));
    } else if (isRecord(bookingData) && Array.isArray((bookingData as BookingDataInput).selectedAddOns)) {
      // If bookingData has selectedAddOns as IDs
      formattedAddOns = ((bookingData as BookingDataInput).selectedAddOns as unknown[]).map((id) => {
        const safeId = sanitizeText(asString(id), 60);
        const found = addOnsData.find(a => a.id === safeId);
        return found ? { name: found.name, price: found.price, category: found.category } : { name: `Add-on ${safeId}`, price: 'N/A', category: 'General' };
      });
    }

    // Build the add-ons list HTML
    const addOnsHtml = formattedAddOns.length > 0 
      ? formattedAddOns.map(addon => 
          `<span class="addon-tag">${escapeHtml(addon.name)} (${escapeHtml(addon.price)})</span>`
        ).join(' ')
      : '<span style="color: #94a3b8;">None selected</span>';

    // Build add-ons list for summary
    const addOnsNames = formattedAddOns.map(a => a.name);
    const addOnsSummaryText = addOnsNames.length > 0 ? addOnsNames.join(', ') : 'None';
    const safePackageName = sanitizeText(asString(packageName), 120);
    const safeServiceType = sanitizeText(asString(serviceType), 120);
    const safePackagePrice = sanitizeText(asString(packagePrice), 40);
    const safeAddOnsTotal = sanitizeText(asString(addOnsTotal), 40);
    const safeTotalPrice = sanitizeText(asString(totalPrice), 40);
    const safeBookingType = sanitizeText(asString(bookingType), 80);
    const safeCategory = sanitizeText(asString(category), 80);
    const safeAddOnsSummaryText = sanitizeText(addOnsSummaryText, 500);
    const safeTimestamp = asString(timestamp);
    const submittedAt = safeTimestamp && !Number.isNaN(new Date(safeTimestamp).getTime())
      ? new Date(safeTimestamp)
      : new Date();
    const selectedAddOnIds = isRecord(bookingData) && Array.isArray((bookingData as BookingDataInput).selectedAddOns)
      ? ((bookingData as BookingDataInput).selectedAddOns as unknown[])
        .map((id) => sanitizeText(asString(id), 60))
        .filter(Boolean)
        .join(', ')
      : 'None';

    // Format date
    const safePreferredDate = asString(preferredDate);
    const formattedDate = safePreferredDate && !Number.isNaN(new Date(safePreferredDate).getTime())
      ? new Date(safePreferredDate).toLocaleDateString('en-AU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Not specified';

    // Build email HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Residential Booking</title>
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
          .badge-residential { 
            display: inline-block; 
            background: #059669; 
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
          .highlight { 
            background: #dbeafe; 
            padding: 2px 8px; 
            border-radius: 4px; 
            font-weight: 600; 
          }
          @media (max-width: 600px) {
            .header { padding: 20px; }
            .content { padding: 16px 20px; }
            .grid { grid-template-columns: 1fr; }
            .total-amount { font-size: 20px; }
            .row { flex-direction: column; align-items: flex-start; gap: 2px; }
            .value { text-align: left; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>New Residential Booking</h1>
            <p>${escapeHtml(submittedAt.toLocaleString('en-AU', {
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }))}</p>
            <div>
              <span class="badge">● Pending Confirmation</span>
              <span class="badge-residential">🧹 Residential Cleaning</span>
            </div>
          </div>

          <div class="content">
            <!-- Customer Information -->
            <div class="section">
              <div class="section-title">
                <span class="icon">◈</span> Customer Information
              </div>
              <div class="grid">
                <div class="row">
                  <span class="label">Name</span>
                  <span class="value">${escapeHtml(`${firstNameClean} ${lastNameClean}`.trim())}</span>
                </div>
                <div class="row">
                  <span class="label">Email</span>
                  <span class="value">${escapeHtml(safeEmail)}</span>
                </div>
                <div class="row">
                  <span class="label">Phone</span>
                  <span class="value">${escapeHtml(safePhone)}</span>
                </div>
                <div class="row row-full">
                  <span class="label">Address</span>
                  <span class="value">${escapeHtml(safeAddress || 'Not specified')}</span>
                </div>
                <div class="row">
                  <span class="label">Suburb</span>
                  <span class="value">${escapeHtml(safeSuburb || 'Not specified')}</span>
                </div>
                <div class="row">
                  <span class="label">Category</span>
                  <span class="value"><span class="highlight">${escapeHtml(safeCategory || 'Residential')}</span></span>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="section">
              <div class="section-title">
                <span class="icon">◈</span> Booking Details
              </div>
              <div class="grid">
                <div class="row">
                  <span class="label">Service Type</span>
                  <span class="value value-highlight">${escapeHtml(safeServiceType || safePackageName)}</span>
                </div>
                <div class="row">
                  <span class="label">Bedrooms</span>
                  <span class="value">${escapeHtml(bedrooms)}</span>
                </div>
                <div class="row">
                  <span class="label">Bathrooms</span>
                  <span class="value">${escapeHtml(bathrooms)}</span>
                </div>
                <div class="row">
                  <span class="label">Preferred Date</span>
                  <span class="value">${escapeHtml(formattedDate)}</span>
                </div>
                ${safeSpecialInstructions ? `
                  <div class="row row-full">
                    <span class="label">Special Instructions</span>
                    <span class="value">${escapeHtml(safeSpecialInstructions)}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Package -->
            <div class="section">
              <div class="section-title">
                <span class="icon">◈</span> Selected Package
              </div>
              <div class="grid">
                <div class="row row-full">
                  <span class="label">Package</span>
                  <span class="value value-highlight">${escapeHtml(safePackageName || safeServiceType)}</span>
                </div>
                <div class="row">
                  <span class="label">Package Price</span>
                  <span class="value value-highlight">${escapeHtml(safePackagePrice)}</span>
                </div>
              </div>
            </div>

            <!-- Add-ons -->
            <div class="section">
              <div class="section-title">
                <span class="icon">◈</span> Add-ons
              </div>
              <div style="margin-bottom: 8px;">
                ${addOnsHtml}
              </div>
              <div class="row">
                <span class="label">Add-ons Summary</span>
                <span class="value">${escapeHtml(safeAddOnsSummaryText)}</span>
              </div>
              ${safeAddOnsTotal ? `
                <div class="row">
                  <span class="label">Add-ons Total</span>
                  <span class="value value-highlight">${escapeHtml(safeAddOnsTotal)}</span>
                </div>
              ` : ''}
            </div>

            <!-- Total -->
            <div class="section">
              <div class="total-box">
                <div class="total-row">
                  <span class="total-label">Total Amount</span>
                  <span class="total-amount">${escapeHtml(safeTotalPrice)}</span>
                </div>
                <div style="margin-top: 6px; text-align: right; font-size: 11px; color: #94a3b8;">
                  Includes package + add-ons
                </div>
              </div>
            </div>

            <!-- Raw Booking Data (for reference) -->
            <div class="section" style="margin-top: 16px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div class="section-title" style="margin-bottom: 8px; font-size: 12px; border-bottom: none; padding-bottom: 4px;">
                <span class="icon">◈</span> Additional Information
              </div>
              <div class="grid">
                <div class="row">
                  <span class="label">Booking Type</span>
                  <span class="value">${escapeHtml(safeBookingType || 'Residential Cleaning')}</span>
                </div>
                <div class="row">
                  <span class="label">Booking Reference</span>
                  <span class="value" style="font-size: 11px; color: #64748b;">${escapeHtml(submittedAt.getTime().toString().slice(-8))}</span>
                </div>
                <div class="row">
                  <span class="label">Category</span>
                  <span class="value">${escapeHtml(safeCategory || 'Residential')}</span>
                </div>
                <div class="row">
                  <span class="label">Selected Add-ons (IDs)</span>
                  <span class="value" style="font-size: 11px;">${escapeHtml(selectedAddOnIds)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: 600; color: #64748b;">Shining Property Service</p>
            <p>This residential booking was submitted from the Shining Property Service website.</p>
            <p>© ${new Date().getFullYear()} Shining Property Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create transporter with Gmail
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
      subject: `Residential Booking: ${safePackageName || safeServiceType} - ${firstNameClean} ${lastNameClean}`,
      html: html,
      replyTo: safeEmail,
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
