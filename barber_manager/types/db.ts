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
  created_at: string;
  updated_at: string;
  settings: Record<string, any>; // jsonb
  owner_user_id: string; // uuid
};

export type ClientTenant = {
  id: Tenant["id"]; // uuid
  name: Tenant["name"];
  slug: Tenant["slug"];
  settings: Tenant["settings"]; // jsonb
};

export type TenantSettings = {
  is_open: boolean; // Assuming 'is_open' will always be a boolean
  // Add other settings properties here as they are added to the JSONB
  [key: string]: any; // Allow for other properties if you don't want to define all upfront
}

export type User = {
  id: string; // uuid
  role: UserRole;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string;
};

export type QueueEntry = {
  id: string; // uuid
  created_at: string;
  name: string;
  status: QueueStatus;
  started_at: string | null;
  finished_at: string | null;
  barber_id: string | null;
};

export type Barber = {
  id: string; // uuid
  first_name: string;
  last_name: string;
  status: BarberStatus;
};

// ===== SERVER ACTION RETURN TYPE =====
export type ServerActionReturn<TData = Record<string, unknown>> =
  | {
      success: true;
      message?: string; // Optional success message
      data?: TData;     // Optional data returned on success
    }
  | {
      success: false;
      message?: string; // Optional error message
      data?: TData;     // Optional data (e.g., error details) returned on failure
    };