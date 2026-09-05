/* eslint-disable @typescript-eslint/no-explicit-any */
// Compatibility client: keeps the old Supabase-style calls, backed by Railway Postgres API routes.
type QueryError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

type QueryResponse<T = any> = {
  data: T | null;
  error: QueryError | null;
};

type Filter = {
  column: string;
  operator: 'eq';
  value: unknown;
};

type OrderBy = {
  column: string;
  ascending?: boolean;
};

class PostgresQueryBuilder implements PromiseLike<QueryResponse> {
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectColumns = '*';
  private filters: Filter[] = [];
  private orderBy: OrderBy[] = [];
  private limitCount?: number;
  private singleResult = false;
  private values?: Record<string, unknown> | Record<string, unknown>[];

  constructor(private table: string) {}

  select(columns = '*') {
    this.selectColumns = columns;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy.push({ column, ascending: options?.ascending });
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  insert(values: Record<string, any> | Record<string, any>[]) {
    this.action = 'insert';
    this.values = values;
    return this;
  }

  update(values: Record<string, any>) {
    this.action = 'update';
    this.values = values;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  then<TResult1 = QueryResponse, TResult2 = never>(
    onfulfilled?: ((value: QueryResponse) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResponse> {
    try {
      const response = await fetch(`/api/postgres/${encodeURIComponent(this.table)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: this.action,
          select: this.selectColumns,
          filters: this.filters,
          orderBy: this.orderBy,
          limit: this.limitCount,
          single: this.singleResult,
          values: this.values,
        }),
      });

      const result = (await response.json()) as QueryResponse;
      if (!response.ok) {
        return {
          data: null,
          error: result.error || { message: 'Database request failed.' },
        };
      }

      if (this.singleResult && !result.data) {
        return {
          data: null,
          error: { message: 'No rows found', code: 'PGRST116' },
        };
      }

      return result;
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Database request failed.',
        },
      };
    }
  }
}

export function createClient() {
  return {
    from(table: string) {
      return new PostgresQueryBuilder(table);
    },
    auth: {
      async getSession() {
        const response = await fetch('/api/auth/me', { method: 'GET' });
        const result = await response.json();
        return {
          data: { session: result.user ? { user: result.user } : null },
          error: result.error ?? null,
        };
      },
      async getUser() {
        const response = await fetch('/api/auth/me', { method: 'GET' });
        const result = await response.json();
        return {
          data: { user: result.user ?? null },
          error: result.error ?? null,
        };
      },
      async signInWithPassword(credentials: { email: string; password: string }) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const result = await response.json();
        return {
          data: { user: result.user ?? null, session: result.user ? { user: result.user } : null },
          error: response.ok ? null : { message: result.error || 'Invalid email or password' },
        };
      },
      async signOut() {
        await fetch('/api/auth/logout', { method: 'POST' });
        return { error: null };
      },
    },
  };
}
