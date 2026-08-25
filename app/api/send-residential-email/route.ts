import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
      addOnsSummary,
      
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
    let firstNameClean = (firstName || '').trim();
    let lastNameClean = (lastName || '').trim();

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
      formattedAddOns = addOns.map((addon: any) => ({
        name: addon.name || 'Unknown',
        price: addon.price || 'N/A',
        category: addon.category || 'General',
      }));
    } else if (bookingData?.selectedAddOns && Array.isArray(bookingData.selectedAddOns)) {
      // If bookingData has selectedAddOns as IDs
      formattedAddOns = bookingData.selectedAddOns.map((id: string) => {
        const found = addOnsData.find(a => a.id === id);
        return found ? { name: found.name, price: found.price, category: found.category } : { name: `Add-on ${id}`, price: 'N/A', category: 'General' };
      });
    }

    // Build the add-ons list HTML
    const addOnsHtml = formattedAddOns.length > 0 
      ? formattedAddOns.map(addon => 
          `<span class="addon-tag">${addon.name} (${addon.price})</span>`
        ).join(' ')
      : '<span style="color: #94a3b8;">None selected</span>';

    // Build add-ons list for summary
    const addOnsNames = formattedAddOns.map(a => a.name);
    const addOnsSummaryText = addOnsNames.length > 0 ? addOnsNames.join(', ') : 'None';

    // Format date
    const formattedDate = preferredDate 
      ? new Date(preferredDate).toLocaleDateString('en-AU', {
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
            <p>${timestamp ? new Date(timestamp).toLocaleString('en-AU', { 
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
            })}</p>
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
                  <span class="value">${firstNameClean} ${lastNameClean}</span>
                </div>
                <div class="row">
                  <span class="label">Email</span>
                  <span class="value">${email}</span>
                </div>
                <div class="row">
                  <span class="label">Phone</span>
                  <span class="value">${phone}</span>
                </div>
                <div class="row row-full">
                  <span class="label">Address</span>
                  <span class="value">${address || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Suburb</span>
                  <span class="value">${suburb || 'Not specified'}</span>
                </div>
                <div class="row">
                  <span class="label">Category</span>
                  <span class="value"><span class="highlight">${category || 'Residential'}</span></span>
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
                  <span class="value value-highlight">${serviceType || packageName}</span>
                </div>
                <div class="row">
                  <span class="label">Bedrooms</span>
                  <span class="value">${bedrooms}</span>
                </div>
                <div class="row">
                  <span class="label">Bathrooms</span>
                  <span class="value">${bathrooms}</span>
                </div>
                <div class="row">
                  <span class="label">Preferred Date</span>
                  <span class="value">${formattedDate}</span>
                </div>
                ${specialInstructions ? `
                  <div class="row row-full">
                    <span class="label">Special Instructions</span>
                    <span class="value">${specialInstructions}</span>
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
                  <span class="value value-highlight">${packageName || serviceType}</span>
                </div>
                <div class="row">
                  <span class="label">Package Price</span>
                  <span class="value value-highlight">${packagePrice}</span>
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
                <span class="value">${addOnsSummaryText}</span>
              </div>
              ${addOnsTotal ? `
                <div class="row">
                  <span class="label">Add-ons Total</span>
                  <span class="value value-highlight">${addOnsTotal}</span>
                </div>
              ` : ''}
            </div>

            <!-- Total -->
            <div class="section">
              <div class="total-box">
                <div class="total-row">
                  <span class="total-label">Total Amount</span>
                  <span class="total-amount">${totalPrice}</span>
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
                  <span class="value">${bookingType || 'Residential Cleaning'}</span>
                </div>
                <div class="row">
                  <span class="label">Booking Reference</span>
                  <span class="value" style="font-size: 11px; color: #64748b;">${timestamp ? new Date(timestamp).getTime().toString().slice(-8) : 'N/A'}</span>
                </div>
                <div class="row">
                  <span class="label">Category</span>
                  <span class="value">${category || 'Residential'}</span>
                </div>
                <div class="row">
                  <span class="label">Selected Add-ons (IDs)</span>
                  <span class="value" style="font-size: 11px;">${bookingData?.selectedAddOns?.join(', ') || 'None'}</span>
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
      subject: `Residential Booking: ${packageName || serviceType} - ${firstNameClean} ${lastNameClean}`,
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