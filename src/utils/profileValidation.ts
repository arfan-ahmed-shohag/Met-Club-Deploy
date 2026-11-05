import locations from "../data/bangladesh-locations.json";
import { normalizeName, normalizePhone, validateLoginPassword, validateName, validatePassword, validatePhone } from "./userValidation";

export interface ProfileValues {
  fullName: string;
  institution: string;
  class: string;
  guardianPhone: string;
  division: string;
  district: string;
  thana: string;
}

export type ProfileErrors = Partial<Record<keyof ProfileValues | "photo" | "root", string>>;
export interface PasswordValues { currentPassword: string; newPassword: string; confirmPassword: string }

export function validateProfile(values: ProfileValues, validateAddress = true): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = validateName(values.fullName);
  const phone = validatePhone(values.guardianPhone);
  if (name !== true) errors.fullName = name;
  if (phone !== true) errors.guardianPhone = phone;
  const institution = normalizeName(values.institution);
  if (institution.length < 2 || institution.length > 200) errors.institution = "প্রতিষ্ঠানের নাম ২ থেকে ২০০ অক্ষরের মধ্যে দিন";
  if (!/^\d{1,2}$/.test(values.class) || Number(values.class) > 12) errors.class = "সঠিক শ্রেণি নির্বাচন করুন";
  if (validateAddress) {
    const division = locations.find((item) => item.name === values.division);
    const district = division?.districts.find((item) => item.name === values.district);
    if (!division) errors.division = "সঠিক বিভাগ নির্বাচন করুন";
    if (!district) errors.district = "নির্বাচিত বিভাগের জেলা নির্বাচন করুন";
    if (!district?.thanas.includes(values.thana)) errors.thana = "নির্বাচিত জেলার থানা / উপজেলা নির্বাচন করুন";
  }
  return errors;
}

export function normalizeProfile(values: ProfileValues) {
  return { ...values, fullName: normalizeName(values.fullName), institution: normalizeName(values.institution), guardianPhone: normalizePhone(values.guardianPhone), class: Number(values.class) };
}

export function validatePasswordChange(values: PasswordValues) {
  const errors: Partial<Record<keyof PasswordValues | "root", string>> = {};
  const current = validateLoginPassword(values.currentPassword);
  const next = validatePassword(values.newPassword);
  if (current !== true) errors.currentPassword = current;
  if (next !== true) errors.newPassword = next;
  if (!values.confirmPassword) errors.confirmPassword = "পাসওয়ার্ড আবার লিখুন";
  else if (values.confirmPassword !== values.newPassword) errors.confirmPassword = "পাসওয়ার্ড দুটি মিলছে না";
  if (values.currentPassword && values.currentPassword === values.newPassword) errors.newPassword = "নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে";
  return errors;
}

export function validateProfilePhoto(file: Pick<File, "type" | "size">): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "JPG, PNG অথবা WebP ছবি নির্বাচন করুন";
  if (!file.size || file.size > 2 * 1024 * 1024) return "ছবির আকার সর্বোচ্চ ২ MB হতে পারবে";
  return null;
}
