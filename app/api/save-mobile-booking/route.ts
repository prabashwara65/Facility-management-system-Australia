import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres/server';
import {
  isValidEmail,
  sanitizeEmail,
  sanitizeInputValue,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizePostcode,
  sanitizeText,
  validateSafePayload,
} from '@/lib/security/input';

interface MobileBookingPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  addressUnit?: string;
  city?: string;
  state?: string;
  infoZipCode?: string;
  zipCode?: string;
  selectedCategory?: string | null;
  selectedYear?: string;
  selectedMake?: string;
  selectedModel?: string;
  selectedBody?: string;
  vehicleCount?: number;
  selectedPackage?: {
    id?: number | string;
    name?: string;
    price?: string | number;
    description?: string;
  } | null;
  selectedAddOns?: Record<string, number> | Array<Record<string, unknown>>;
  selectedConditions?: string[];
  otherCondition?: string;
  selectedDate?: string | null;
  selectedArrivalWindows?: string[];
  backupDate?: string | null;
  waterAccess?: 'yes' | 'no' | null;
  electricity?: 'yes' | 'no' | null;
  coveredArea?: 'yes' | 'no' | null;
  extraInfo?: string;
  marketingOptIn?: boolean;
  packagePrice?: string | number;
  addonsTotal?: string | number;
  addOnsTotal?: string;
  totalPrice?: string | number;
  timestamp?: string;
}

function parseMoney(value: string | number | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateOnly(value: string | null | undefined): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function toIsoDate(value: string | null | undefined): string {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function POST(request: Request) {
  try {
    const unsafePayload = (await request.json()) as MobileBookingPayload;
    const unsafeMessage = validateSafePayload(unsafePayload, 'Booking');

    if (unsafeMessage) {
      return NextResponse.json({ success: false, error: unsafeMessage }, { status: 400 });
    }

    const payload = sanitizeInputValue(unsafePayload) as MobileBookingPayload;
    const email = sanitizeEmail(payload.email || '');

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const packageId = Number(payload.selectedPackage?.id);
    const vehicleCategory = payload.selectedCategory && payload.selectedCategory !== 'all'
      ? sanitizeText(payload.selectedCategory, 80)
      : null;

    const record = {
      first_name: sanitizeText(payload.firstName || '', 80),
      last_name: sanitizeText(payload.lastName || '', 80),
      email,
      phone: sanitizePhone(payload.phone || ''),
      address: sanitizeText(payload.address || '', 180),
      address_unit: sanitizeText(payload.addressUnit || '', 80),
      city: sanitizeText(payload.city || '', 80),
      state: sanitizeText(payload.state || '', 40),
      zip_code: sanitizePostcode(payload.zipCode || payload.infoZipCode || ''),
      service_area_zip: sanitizePostcode(payload.infoZipCode || payload.zipCode || ''),
      booking_type: 'mobile',
      vehicle_year: sanitizeText(payload.selectedYear || '', 10),
      vehicle_brand: sanitizeText(payload.selectedMake || '', 80),
      vehicle_model: sanitizeText(payload.selectedModel || '', 80),
      vehicle_body: sanitizeText(payload.selectedBody || '', 80),
      vehicle_category: vehicleCategory,
      vehicle_count: payload.vehicleCount ?? 1,
      package_id: Number.isFinite(packageId) ? packageId : null,
      package_name: sanitizeText(payload.selectedPackage?.name || '', 120),
      package_price: parseMoney(payload.selectedPackage?.price ?? payload.packagePrice),
      package_description: sanitizeText(payload.selectedPackage?.description || '', 300),
      conditions: (payload.selectedConditions || []).map((condition) => sanitizeText(condition, 80)),
      other_condition: sanitizeText(payload.otherCondition || '', 180),
      add_ons: JSON.stringify(sanitizeInputValue(payload.selectedAddOns || [])),
      add_ons_total: parseMoney(payload.addonsTotal ?? payload.addOnsTotal),
      appointment_date: toDateOnly(payload.selectedDate),
      selected_windows: (payload.selectedArrivalWindows || []).map((window) => sanitizeText(window, 80)),
      backup_date: payload.backupDate ? toDateOnly(payload.backupDate) : null,
      covered_area: payload.coveredArea ?? null,
      electricity: payload.electricity ?? null,
      water_access: payload.waterAccess ?? null,
      extra_info: sanitizeMultilineText(payload.extraInfo || '', 1000),
      marketing_opt_in: Boolean(payload.marketingOptIn),
      total_price: parseMoney(payload.totalPrice),
      status: 'pending',
      created_at: toIsoDate(payload.timestamp),
    };

    const columns = Object.keys(record);
    const values = Object.values(record);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const result = await query<{ id: string }>(
      `INSERT INTO vehicle_bookings (${columns.map((column) => `"${column}"`).join(', ')})
       VALUES (${placeholders})
       RETURNING id`,
      values
    );

    return NextResponse.json({
      success: true,
      bookingId: result.rows[0]?.id,
      message: 'Booking confirmed and recorded successfully.',
    });
  } catch (error) {
    console.error('[save-mobile-booking] failed', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save booking.' },
      { status: 500 }
    );
  }
}
