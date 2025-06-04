// ===== ENUMS & CONSTANTS =====
export const BARBER_STATUS = {
  OFFSITE: "offsite",
  ONSITE: "onsite",
  BREAK: "break",
} as const;

export const USER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  EMPLOYEE: "employee",
  CUSTOMER: "customer",
} as const;

export const QUEUE_STATUS = {
  WAITING: "waiting",
  IN_PROGRESS: "in progress",
  FINISHED: "finished",
  CANCELLED: "cancelled",
} as const;

export const TABLE_NAMES = {
  BARBERS: "barbers",
  QUEUE: "queue",
  TENANTS: "tenants",
  USERS: "users",
} as const;

// ===== TYPE UNIONS =====
export type BarberStatus = (typeof BARBER_STATUS)[keyof typeof BARBER_STATUS];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type QueueStatus = (typeof QUEUE_STATUS)[keyof typeof QUEUE_STATUS];
export type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];

//===== MAIN TYPES  =====

export type Tenant = {
  id: string; // uuid
  name: string;
  slug: string | null;
  is_active: boolean;
  created_at: string; // timestamp
  updated_at: string; // timestamp
  settings: Record<string, any>; // jsonb
  owner_user_id: string; // uuid
};

export type User = {
  id: string; // uuid
  role: UserRole;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null; // Should this be nullable?
};

export type QueueEntry = {
  id: number;
  created_at: string;
  name: string;
  status: QueueStatus;
  started_at: string | null;
  finished_at: string | null;
  barber_id: number | null;
};

export type Barber = {
  id: number;
  first_name: string;
  last_name: string;
  status: BarberStatus;
};

// ===== TENANT-AWARE TYPES =====
export type TenantAware<T> = T & {
  tenant_id: string; // Non-nullable for tenant-aware operations
};

export type TenantAwareQueueEntry = TenantAware<QueueEntry>;
export type TenantAwareBarber = TenantAware<Barber>;
