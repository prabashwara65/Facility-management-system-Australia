import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres/server';
import {
  mapInputRecord,
  mapOutputRow,
  resolveColumnName,
  resolveTableName,
  tableColumns,
  type PublicTable,
} from '@/lib/postgres/schema';

type Filter = {
  column: string;
  operator: 'eq';
  value: unknown;
};

type OrderBy = {
  column: string;
  ascending?: boolean;
};

type RequestBody = {
  action?: 'select' | 'insert' | 'update' | 'delete';
  select?: string;
  filters?: Filter[];
  orderBy?: OrderBy[];
  limit?: number;
  single?: boolean;
  values?: Record<string, unknown> | Record<string, unknown>[];
};

function parseColumns(table: PublicTable, select?: string) {
  if (!select || select.trim() === '*' || select.includes('\n') || select.includes('(')) {
    return '*';
  }

  const columns = select
    .split(',')
    .map((column) => resolveColumnName(table, column.trim()))
    .filter(Boolean);

  return columns.length ? columns.map((column) => `"${column}"`).join(', ') : '*';
}

function appendFilters(sql: string, values: unknown[], table: PublicTable, filters: Filter[] = []) {
  if (!filters.length) return sql;

  const clauses = filters.map((filter) => {
    if (filter.operator !== 'eq') {
      throw new Error(`Filter operator is not supported: ${filter.operator}`);
    }

    const column = resolveColumnName(table, filter.column);
    values.push(filter.value);
    return `"${column}" = $${values.length}`;
  });

  return `${sql} WHERE ${clauses.join(' AND ')}`;
}

function appendOrdering(sql: string, table: PublicTable, orderBy: OrderBy[] = []) {
  if (!orderBy.length) return sql;

  const clauses = orderBy.map((order) => {
    const column = resolveColumnName(table, order.column);
    return `"${column}" ${order.ascending === false ? 'DESC' : 'ASC'}`;
  });

  return `${sql} ORDER BY ${clauses.join(', ')}`;
}

function appendLimit(sql: string, limit?: number, single?: boolean) {
  const safeLimit = single ? 1 : limit;
  if (!safeLimit || safeLimit < 1) return sql;
  return `${sql} LIMIT ${Math.min(safeLimit, 500)}`;
}

function buildSelectSql(table: PublicTable, body: RequestBody, values: unknown[]) {
  const columns = parseColumns(table, body.select);

  if ((table === 'vehicle_models' || table === 'vehicle_body_types') && (!body.select || body.select.includes('vehicle_makes'))) {
    let sql = `
      SELECT ${table}.*, vehicle_brands.name AS brand_name
      FROM "${table}"
      LEFT JOIN vehicle_brands ON vehicle_brands.id = "${table}".brand_id
    `;
    sql = appendFilters(sql, values, table, body.filters);
    sql = appendOrdering(sql, table, body.orderBy);
    return appendLimit(sql, body.limit, body.single);
  }

  let sql = `SELECT ${columns} FROM "${table}"`;
  sql = appendFilters(sql, values, table, body.filters);
  sql = appendOrdering(sql, table, body.orderBy);
  return appendLimit(sql, body.limit, body.single);
}

function buildInsertSql(table: PublicTable, body: RequestBody, values: unknown[]) {
  const records = (Array.isArray(body.values) ? body.values : [body.values]).filter(Boolean) as Record<string, unknown>[];
  if (!records.length) throw new Error('Insert requires values.');

  const mappedRecords = records.map((record) => mapInputRecord(table, record));
  const columns = Object.keys(mappedRecords[0]);
  columns.forEach((column) => resolveColumnName(table, column));

  const rowsSql = mappedRecords.map((record) => {
    const placeholders = columns.map((column) => {
      values.push(record[column] ?? null);
      return `$${values.length}`;
    });
    return `(${placeholders.join(', ')})`;
  });

  const returning = parseColumns(table, body.select);
  return `
    INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(', ')})
    VALUES ${rowsSql.join(', ')}
    RETURNING ${returning}
  `;
}

function buildUpdateSql(table: PublicTable, body: RequestBody, values: unknown[]) {
  if (!body.values || Array.isArray(body.values)) throw new Error('Update requires one values object.');
  const mappedRecord = mapInputRecord(table, body.values);
  const entries = Object.entries(mappedRecord);
  if (!entries.length) throw new Error('Update requires at least one value.');

  const setSql = entries.map(([column, value]) => {
    values.push(value);
    return `"${resolveColumnName(table, column)}" = $${values.length}`;
  });

  let sql = `UPDATE "${table}" SET ${setSql.join(', ')}`;
  sql = appendFilters(sql, values, table, body.filters);
  const returning = parseColumns(table, body.select);
  return `${sql} RETURNING ${returning}`;
}

function buildDeleteSql(table: PublicTable, body: RequestBody, values: unknown[]) {
  let sql = `DELETE FROM "${table}"`;
  sql = appendFilters(sql, values, table, body.filters);
  return `${sql} RETURNING *`;
}

export async function POST(request: Request, context: { params: Promise<{ table: string }> }) {
  try {
    const { table: requestedTable } = await context.params;
    const table = resolveTableName(requestedTable);
    const body = (await request.json()) as RequestBody;
    const action = body.action || 'select';
    const values: unknown[] = [];

    if (!(table in tableColumns)) {
      throw new Error(`Table is not allowed: ${requestedTable}`);
    }

    let sql = '';
    if (action === 'select') sql = buildSelectSql(table, body, values);
    if (action === 'insert') sql = buildInsertSql(table, body, values);
    if (action === 'update') sql = buildUpdateSql(table, body, values);
    if (action === 'delete') sql = buildDeleteSql(table, body, values);
    if (!sql) throw new Error(`Action is not supported: ${action}`);

    const result = await query(sql, values);
    const rows = result.rows.map((row) => mapOutputRow(table, row));

    return NextResponse.json({
      data: body.single ? rows[0] ?? null : rows,
      error: null,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('[postgres-api] request failed', error);
    return NextResponse.json(
      {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Database request failed.',
        },
      },
      { status: 500 }
    );
  }
}
