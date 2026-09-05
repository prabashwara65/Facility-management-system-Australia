export const tableColumns = {
  admin_users: ['id', 'email', 'full_name', 'role', 'is_active', 'password_hash', 'last_login', 'created_at', 'updated_at'],
  addons: ['id', 'name', 'price', 'description', 'category', 'is_active', 'sort_order', 'created_at', 'updated_at'],
  bookings: [
    'id', 'phone', 'email', 'service_area', 'hours', 'guarantee_title', 'guarantee_description',
    'first_name', 'last_name', 'service_type', 'bedrooms', 'bathrooms', 'address', 'suburb',
    'preferred_date', 'special_instructions', 'status', 'total_price', 'selected_package',
    'selected_addons', 'booking_data', 'created_at', 'updated_at',
  ],
  contact_info: ['id', 'phone', 'email', 'service_area', 'hours', 'guarantee_title', 'guarantee_description', 'created_at', 'updated_at'],
  faqs: ['id', 'question', 'answer', 'category', 'sort_order', 'created_at', 'updated_at'],
  pricing_tiers: ['id', 'label', 'price', 'description', 'category', 'is_popular', 'status', 'bookings', 'rating', 'sort_order', 'created_at', 'updated_at'],
  promise_features: ['id', 'icon', 'title', 'description', 'status', 'order', 'created_at', 'updated_at'],
  service_areas: ['id', 'name', 'region', 'status', 'created_at', 'updated_at'],
  services: ['id', 'icon', 'title', 'price', 'description', 'is_active', 'sort_order', 'created_at', 'updated_at'],
  testimonials: ['id', 'name', 'location', 'quote', 'rating', 'verified', 'status', 'created_at', 'updated_at'],
  vehicle_add_on_options: ['id', 'name', 'price', 'description', 'details', 'per_seat', 'created_at', 'updated_at'],
  vehicle_arrival_windows: ['id', 'window_time', 'display_order', 'created_at'],
  vehicle_australian_postcodes: ['id', 'state', 'min_postcode', 'max_postcode', 'created_at'],
  vehicle_body_types: ['id', 'brand_id', 'make_id', 'name', 'created_at'],
  vehicle_bookings: [
    'id', 'booking_type', 'first_name', 'last_name', 'email', 'phone', 'address', 'address_unit',
    'city', 'state', 'zip_code', 'service_area_zip', 'vehicle_year', 'vehicle_brand',
    'vehicle_make', 'vehicle_model', 'vehicle_body', 'vehicle_category', 'vehicle_count',
    'package_id', 'package_name', 'package_price', 'package_description', 'conditions',
    'other_condition', 'add_ons', 'add_ons_total', 'appointment_date', 'selected_windows',
    'backup_date', 'water_access', 'electricity', 'covered_area', 'extra_info',
    'marketing_opt_in', 'total_price', 'status', 'created_at', 'updated_at',
    'confirmed_at', 'completed_at', 'cancelled_at',
  ],
  vehicle_brands: ['id', 'name', 'category_id', 'created_at'],
  vehicle_categories: ['id', 'label', 'icon_name', 'created_at'],
  vehicle_models: ['id', 'brand_id', 'make_id', 'name', 'created_at'],
  vehicle_service_exterior_items: ['id', 'service_id', 'item', 'display_order', 'created_at'],
  vehicle_service_interior_items: ['id', 'service_id', 'item', 'display_order', 'created_at'],
  vehicle_services: ['id', 'name', 'price', 'rating', 'reviews', 'popular', 'description', 'vehicle_type', 'estimated_time', 'created_at', 'updated_at'],
} as const;

export type PublicTable = keyof typeof tableColumns;

export function resolveTableName(table: string): PublicTable {
  if (table === 'vehicle_makes') return 'vehicle_brands';
  if (table in tableColumns) return table as PublicTable;
  throw new Error(`Table is not allowed: ${table}`);
}

export function resolveColumnName(table: PublicTable, column: string): string {
  if ((table === 'vehicle_models' || table === 'vehicle_body_types') && column === 'make_id') {
    return 'brand_id';
  }

  if (table === 'vehicle_bookings' && column === 'vehicle_make') {
    return 'vehicle_brand';
  }

  if (!tableColumns[table].includes(column as never)) {
    throw new Error(`Column is not allowed: ${table}.${column}`);
  }

  return column;
}

export function mapInputRecord(table: PublicTable, record: Record<string, unknown>) {
  const next: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    const column = resolveColumnName(table, key);
    next[column] = value;
  }

  return next;
}

export function mapOutputRow(table: PublicTable, row: Record<string, unknown>) {
  const next = { ...row };

  if (table === 'vehicle_brands') {
    next.category_id ??= null;
  }

  if (table === 'vehicle_models' || table === 'vehicle_body_types') {
    next.make_id = row.brand_id;
    next.vehicle_makes = {
      id: row.brand_id,
      name: row.brand_name ?? null,
    };
    delete next.brand_name;
  }

  if (table === 'vehicle_bookings') {
    next.vehicle_make = row.vehicle_brand;
  }

  return next;
}
