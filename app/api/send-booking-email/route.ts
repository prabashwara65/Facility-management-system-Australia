import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    // Format selected add-ons
    const addonsList = selectedAddOns ? Object.entries(selectedAddOns)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => `${name} × ${count}`)
      .join(', ') : 'None';

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

    // Build email HTML with gray icons
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Booking Notification</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding: 20px; }
          .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: #1a3a6b; padding: 28px 36px; text-align: center; border-bottom: 3px solid #4a7bc4; }
          .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0; }
          .badge { display: inline-block; background: #d97706; color: white; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
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
            <h1>✦ New Booking Request</h1>
            <p>${new Date().toLocaleString('en-AU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <span class="badge">● Pending Confirmation</span>
          </div>

          <div class="content">
            <!-- Customer Information -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Customer Information</div>
              <div class="grid">
                <div class="row"><span class="label">Name</span><span class="value">${firstName} ${lastName}</span></div>
                <div class="row"><span class="label">Email</span><span class="value">${email}</span></div>
                <div class="row"><span class="label">Phone</span><span class="value">${phone}</span></div>
                <div class="row row-full"><span class="label">Address</span><span class="value">${fullAddress}</span></div>
                <div class="row"><span class="label">Postcode</span><span class="value">${infoZipCode}</span></div>
                <div class="row"><span class="label">State</span><span class="value">${state}</span></div>
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Vehicle Details</div>
              <div class="grid">
                <div class="row"><span class="label">Year</span><span class="value">${selectedYear}</span></div>
                <div class="row"><span class="label">Make</span><span class="value">${selectedMake}</span></div>
                <div class="row"><span class="label">Model</span><span class="value">${selectedModel}</span></div>
                <div class="row"><span class="label">Body Type</span><span class="value">${selectedBody}</span></div>
                <div class="row"><span class="label">Category</span><span class="value">${selectedCategory}</span></div>
                <div class="row"><span class="label">Vehicles</span><span class="value">${vehicleCount}</span></div>
              </div>
            </div>

            <!-- Package -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Selected Package</div>
              <div class="grid">
                <div class="row row-full"><span class="label">Package</span><span class="value value-highlight">${selectedPackage?.name}</span></div>
                <div class="row row-full"><span class="label">Description</span><span class="value">${selectedPackage?.description}</span></div>
              </div>
            </div>

            <!-- Add-ons -->
            ${selectedAddOns && Object.keys(selectedAddOns).length > 0 ? `
              <div class="section">
                <div class="section-title"><span class="icon">◈</span> Add-ons</div>
                <div>
                  ${Object.entries(selectedAddOns)
                    .filter(([_, count]) => count > 0)
                    .map(([name, count]) => `<span class="addon-tag">${name} × ${count}</span>`)
                    .join('')}
                </div>
              </div>
            ` : ''}

            <!-- Vehicle Conditions -->
            ${selectedConditions && selectedConditions.length > 0 ? `
              <div class="section">
                <div class="section-title"><span class="icon">◈</span> Vehicle Conditions</div>
                <div>
                  ${selectedConditions.map((c: string) => `<span class="condition-tag">${c}</span>`).join(' ')}
                  ${otherCondition ? `<span class="condition-tag">Other: ${otherCondition}</span>` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Appointment -->
            <div class="section">
              <div class="section-title"><span class="icon">◈</span> Appointment Details</div>
              <div class="grid">
                <div class="row"><span class="label">Date</span><span class="value">${formattedDate}</span></div>
                <div class="row"><span class="label">Arrival Window</span><span class="value">${selectedArrivalWindows?.join(', ') || 'Not specified'}</span></div>
                <div class="row"><span class="label">Water Access</span><span class="value">${waterAccess || 'Not specified'}</span></div>
                <div class="row"><span class="label">Electricity</span><span class="value">${electricity || 'Not specified'}</span></div>
                <div class="row"><span class="label">Covered Area</span><span class="value">${coveredArea || 'Not specified'}</span></div>
                <div class="row"><span class="label">Marketing Opt-in</span><span class="value">${marketingOptIn ? '✦ Yes' : '○ No'}</span></div>
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
                  <span class="total-amount">${totalPrice}</span>
                </div>
                <div style="margin-top: 6px; text-align: right; font-size: 11px; color: #94a3b8;">
                  Includes package + add-ons
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: 600; color: #64748b;">Shining Property Service</p>
            <p>This booking was submitted from the Shining Property Service website.</p>
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
      subject: `New Booking: ${selectedPackage?.name || 'Booking'} - ${firstName} ${lastName}`,
      html: html,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }, { status: 500 });
  }
}