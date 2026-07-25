import { ROLES, type Role } from "@/constants/roles";

export const PERMISSIONS = {
  BOOKMARKS_MANAGE: "bookmarks:manage",
  NOTES_MANAGE: "notes:manage",
  COLLECTIONS_MANAGE: "collections:manage",
  PROFILE_MANAGE: "profile:manage",
  CONTENT_MODERATE: "content:moderate",
  USERS_MANAGE: "users:manage",
  REPORTS_VIEW: "reports:view",
  ADMIN_ACCESS: "admin:access",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.GUEST]: [],
  [ROLES.USER]: [
    PERMISSIONS.BOOKMARKS_MANAGE,
    PERMISSIONS.NOTES_MANAGE,
    PERMISSIONS.COLLECTIONS_MANAGE,
    PERMISSIONS.PROFILE_MANAGE,
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.BOOKMARKS_MANAGE,
    PERMISSIONS.NOTES_MANAGE,
    PERMISSIONS.COLLECTIONS_MANAGE,
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.CONTENT_MODERATE,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};
