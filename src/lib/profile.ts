import { protectedApi } from "./api";
import { getSessionVersion } from "./authSession";
import { applyCurrentUserUpdate } from "./currentUser";
import type { CurrentUser } from "../types/auth";
import type { PasswordValues } from "../utils/profileValidation";

export function profileImageUrl(value: string | null) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value, protectedApi.defaults.baseURL).href;
}

async function updateProfile(path: string, payload: unknown) {
  const version = getSessionVersion();
  const { data } = await protectedApi.patch<{ success: boolean; data: CurrentUser }>(path, payload);
  if (!data.success || !data.data?.id) throw new Error("Profile update failed");
  if (version !== getSessionVersion()) throw new Error("Session changed");
  applyCurrentUserUpdate(data.data, version);
  return data.data;
}

export const saveProfile = (values: Record<string, string | number>) => updateProfile("/user/me", values);
export function saveProfilePhoto(file: File) {
  const form = new FormData();
  form.append("photo", file);
  return updateProfile("/user/me/photo", form);
}
export async function changePassword(values: PasswordValues) {
  const version = getSessionVersion();
  const { data } = await protectedApi.patch("/auth/change-password", values);
  if (!data.success) throw new Error("Password update failed");
  if (version !== getSessionVersion()) throw new Error("Session changed");
}
