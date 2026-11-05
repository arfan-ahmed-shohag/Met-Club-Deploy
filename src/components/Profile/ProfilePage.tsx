import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { Camera, Eye, EyeOff, LoaderCircle, LogOut, X } from "lucide-react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import type { CurrentUser } from "../../types/auth";
import { changePassword, profileImageUrl, saveProfile, saveProfilePhoto } from "../../lib/profile";
import { normalizeProfile, validatePasswordChange, validateProfile, validateProfilePhoto } from "../../utils/profileValidation";
import type { PasswordValues, ProfileErrors, ProfileValues } from "../../utils/profileValidation";
import locations from "../../data/bangladesh-locations.json";
import bgImage from "../../assets/images/start-journey-page-bg.jpeg";
import TopNav from "../Shared/TopBar";

const glassCard = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.46), rgba(255,255,255,0.30))",
  backdropFilter: "blur(26px) saturate(160%)",
  WebkitBackdropFilter: "blur(26px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.55)",
  boxShadow: "0 26px 80px rgba(30, 64, 175, 0.12), inset 0 1px 0 rgba(255,255,255,0.55)",
};
const controlClass = "mt-1 min-h-14 w-full min-w-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-base leading-8 text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 disabled:bg-gray-100 disabled:text-gray-500";
const primaryClass = "rounded-2xl bg-linear-to-r from-red-500 to-orange-500 px-6 py-3 font-bold text-white shadow-md transition hover:from-red-600 hover:to-orange-600 disabled:cursor-wait disabled:opacity-60";
const secondaryClass = "rounded-2xl border border-white/65 bg-white/60 px-6 py-3 font-bold text-gray-700 transition hover:bg-white/90 disabled:opacity-60";
const valuesFromUser = (user: CurrentUser): ProfileValues => ({ fullName: user.fullName, institution: user.institution, class: String(user.class), guardianPhone: user.guardianPhone, division: user.division ?? "", district: user.district ?? "", thana: user.thana ?? "" });

function requestErrors(error: unknown): Record<string, string> {
  if (error instanceof Error && error.message === "Session changed") return {};
  if (isAxiosError(error) && error.response?.data.errors) return error.response.data.errors;
  return { root: "আপডেট করা যায়নি। আবার চেষ্টা করুন।" };
}

function errorMessage(message: string, isEnglish: boolean) {
  if (!isEnglish) return message;
  const translations: Record<string, string> = {
    "নাম আবশ্যক": "Name is required.",
    "নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে": "Name must contain 2–100 characters.",
    "নামে শুধু অক্ষর, স্পেস, ডট, হাইফেন বা অ্যাপোস্ট্রফি ব্যবহার করুন": "Use letters, spaces, periods, hyphens or apostrophes in your name.",
    "মোবাইল নম্বর আবশ্যক": "Mobile number is required.",
    "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন": "Enter a valid 11 digit Bangladeshi mobile number.",
    "প্রতিষ্ঠানের নাম ২ থেকে ২০০ অক্ষরের মধ্যে দিন": "Institution name must contain 2–200 characters.",
    "সঠিক শ্রেণি নির্বাচন করুন": "Select a valid class.",
    "সঠিক বিভাগ নির্বাচন করুন": "Select a valid division.",
    "নির্বাচিত বিভাগের জেলা নির্বাচন করুন": "Select a district in your division.",
    "নির্বাচিত জেলার থানা / উপজেলা নির্বাচন করুন": "Select a thana or upazila in your district.",
    "পাসওয়ার্ড আবশ্যক": "Password is required.",
    "পাসওয়ার্ড সর্বোচ্চ ৭২ বাইট হতে পারবে": "Password must not exceed 72 UTF-8 bytes.",
    "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে": "Use at least 8 characters.",
    "পাসওয়ার্ড আবার লিখুন": "Confirm your new password.",
    "পাসওয়ার্ড দুটি মিলছে না": "Passwords do not match.",
    "নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে": "New password must be different from your current password.",
    "বর্তমান পাসওয়ার্ড সঠিক নয়": "Current password is incorrect.",
    "পাসওয়ার্ড পরিবর্তিত হয়েছে। আবার চেষ্টা করুন": "Your password has changed. Please try again.",
    "JPG, PNG অথবা WebP ছবি নির্বাচন করুন": "Choose a JPG, PNG or WebP image.",
    "সঠিক JPG, PNG অথবা WebP ছবি নির্বাচন করুন": "Choose a valid JPG, PNG or WebP image.",
    "ছবির আকার সর্বোচ্চ ২ MB হতে পারবে": "Image must be no larger than 2 MB.",
    "সর্বোচ্চ ২ MB এর একটি ছবি নির্বাচন করুন": "Choose an image no larger than 2 MB.",
  };
  return translations[message] ?? "Unable to update. Please check your details and try again.";
}

function PasswordDialog({ isEnglish, onClose }: { isEnglish: boolean; onClose: () => void }) {
  const t = (bn: string, en: string) => isEnglish ? en : bn;
  const dialog = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<PasswordValues>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [visible, setVisible] = useState<Partial<Record<keyof PasswordValues, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordValues | "root", string>>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { dialog.current?.showModal(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePasswordChange(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    try {
      await changePassword(values);
      toast.success(t("পাসওয়ার্ড পরিবর্তন হয়েছে।", "Password updated successfully."));
      onClose();
    } catch (error) { setErrors(requestErrors(error)); }
    finally { setSaving(false); }
  }
  const fields = [
    { name: "currentPassword", label: t("বর্তমান পাসওয়ার্ড", "Current Password"), autoComplete: "current-password" },
    { name: "newPassword", label: t("নতুন পাসওয়ার্ড", "New Password"), autoComplete: "new-password" },
    { name: "confirmPassword", label: t("নতুন পাসওয়ার্ড নিশ্চিত করুন", "Confirm New Password"), autoComplete: "new-password" },
  ] as const;
  return (
    <dialog ref={dialog} aria-labelledby="password-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-4xl border border-white/65 bg-white/95 p-6 text-gray-800 shadow-2xl backdrop:bg-slate-950/30 backdrop:backdrop-blur-md sm:p-8">
      <button type="button" disabled={saving} onClick={onClose} aria-label={t("বন্ধ করুন", "Close")} className="absolute right-5 top-5 rounded p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"><X size={22} /></button>
      <h3 id="password-title" className="mb-6 pr-8 text-2xl font-bold">{t("পাসওয়ার্ড পরিবর্তন", "Change Password")}</h3>
      <form noValidate onSubmit={submit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block text-sm font-semibold">{field.label}</label>
            <div className="relative">
              <input id={field.name} name={field.name} autoComplete={field.autoComplete} required disabled={saving} type={visible[field.name] ? "text" : "password"} value={values[field.name]} onChange={(event) => { setValues({ ...values, [field.name]: event.target.value }); setErrors({ ...errors, [field.name]: undefined, root: undefined }); }} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} className={`${controlClass} pr-12`} />
              <button type="button" onClick={() => setVisible({ ...visible, [field.name]: !visible[field.name] })} aria-label={`${visible[field.name] ? t("লুকান", "Hide") : t("দেখান", "Show")} ${field.label}`} aria-pressed={Boolean(visible[field.name])} className="absolute inset-y-0 right-0 px-4 text-gray-500">{visible[field.name] ? <EyeOff size={19} /> : <Eye size={19} />}</button>
            </div>
            {errors[field.name] && <p id={`${field.name}-error`} role="alert" className="mt-1 text-sm text-red-700">{errorMessage(errors[field.name]!, isEnglish)}</p>}
          </div>
        ))}
        <p className="text-sm text-gray-600">{t("নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।", "Use at least 8 characters for your new password.")}</p>
        {errors.root && <p role="alert" className="text-sm text-red-700">{errorMessage(errors.root, isEnglish)}</p>}
        <div className="flex gap-3 pt-3">
          <button type="button" disabled={saving} onClick={onClose} className={`${secondaryClass} flex-1`}>{t("বাতিল", "Cancel")}</button>
          <button type="submit" disabled={saving} className={`${primaryClass} flex-1`}>{saving ? t("আপডেট হচ্ছে...", "Updating...") : t("আপডেট করুন", "Update")}</button>
        </div>
      </form>
    </dialog>
  );
}

function UserProfile({ user, isEnglish }: { user: CurrentUser; isEnglish: boolean }) {
  const t = (bn: string, en: string) => isEnglish ? en : bn;
  const locale = isEnglish ? "en" : "bn";
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<"general" | "badges">("general");
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [values, setValues] = useState(() => valuesFromUser(user));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [busy, setBusy] = useState<"profile" | "photo" | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (editing) form.current?.querySelector<HTMLInputElement>("#profile-fullName")?.focus();
  }, [editing]);
  const avatar = Array.from(new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(user.fullName.trim()))[0]?.segment.toLocaleUpperCase(locale);
  const division = locations.find((item) => item.name === values.division);
  const district = division?.districts.find((item) => item.name === values.district);
  const update = (field: keyof ProfileValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value, ...(field === "division" ? { district: "", thana: "" } : field === "district" ? { thana: "" } : {}) }));
    setErrors({});
  };
  const startEditing = () => { setValues(valuesFromUser(user)); setErrors({}); setActiveTab("general"); setEditing(true); };
  const cancelEditing = () => { setValues(valuesFromUser(user)); setErrors({}); setEditing(false); };
  const focusError = (fields: ProfileErrors) => {
    const field = Object.keys(fields)[0];
    if (field) form.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || busy) return;
    const addressChanged = (["division", "district", "thana"] as const).some((field) => values[field] !== (user[field] ?? ""));
    const validation = validateProfile(values, addressChanged);
    setErrors(validation);
    if (Object.keys(validation).length) { focusError(validation); return; }
    const normalized = normalizeProfile(values);
    const previous = valuesFromUser(user);
    const payload: Record<string, string | number> = {};
    for (const field of Object.keys(normalized) as Array<keyof ProfileValues>) {
      if (String(normalized[field]) !== previous[field]) payload[field] = normalized[field];
    }
    if (!Object.keys(payload).length) { setEditing(false); return; }
    setBusy("profile");
    try {
      await saveProfile(payload);
      setEditing(false);
      toast.success(t("প্রোফাইল আপডেট হয়েছে।", "Profile updated successfully."));
    } catch (error) { const fields = requestErrors(error); setErrors(fields); focusError(fields); }
    finally { setBusy(null); }
  }
  async function uploadPhoto(file?: File) {
    if (!file) return;
    const invalid = validateProfilePhoto(file);
    if (invalid) { setErrors({ ...errors, photo: invalid }); return; }
    setBusy("photo"); setErrors({ ...errors, photo: undefined, root: undefined });
    try { await saveProfilePhoto(file); toast.success(t("প্রোফাইল ছবি আপডেট হয়েছে।", "Profile photo updated successfully.")); }
    catch (error) { setErrors({ ...errors, ...requestErrors(error) }); }
    finally { setBusy(null); }
  }
  const general = [
    { name: "fullName", label: t("শিক্ষার্থীর পূর্ণ নাম", "Full Name") },
    { name: "class", label: t("শ্রেণি", "Class") },
    { name: "guardianPhone", label: t("মোবাইল নম্বর", "Mobile Number") },
  ] as const;
  const address = [
    { name: "institution", label: t("স্কুলের নাম", "School Name") },
    { name: "division", label: t("বিভাগ", "Division") },
    { name: "district", label: t("জেলা", "District") },
    { name: "thana", label: t("থানা / উপজেলা", "Thana / Upazila") },
  ] as const;
  function field(name: keyof ProfileValues, label: string) {
    const options = name === "class" ? Array.from({ length: 13 }, (_, index) => ({ value: String(index), label: index === 0 ? t("অন্যান্য", "Other") : `${t("শ্রেণি", "Class")} ${new Intl.NumberFormat(locale).format(index)}` })) : name === "division" ? locations.map((item) => ({ value: item.name, label: item.name })) : name === "district" ? (division?.districts ?? []).map((item) => ({ value: item.name, label: item.name })) : name === "thana" ? (district?.thanas ?? []).map((item) => ({ value: item, label: item })) : null;
    const displayValue = name === "class" ? user.class === 0 ? t("অন্যান্য", "Other") : new Intl.NumberFormat(locale).format(user.class) : user[name];
    return <div key={name}>
      <label htmlFor={`profile-${name}`} className="ml-1 text-sm font-semibold text-gray-600">{label}</label>
      {editing ? options ? (
        <select id={`profile-${name}`} name={name} value={values[name]} disabled={Boolean(busy) || (name === "district" && !division) || (name === "thana" && !district)} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `profile-${name}-error` : undefined} className={controlClass}>
          <option value="">{t("নির্বাচন করুন", "Select an option")}</option>
          {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      ) : <input id={`profile-${name}`} name={name} type={name === "guardianPhone" ? "tel" : "text"} autoComplete={name === "fullName" ? "name" : name === "guardianPhone" ? "tel" : "organization"} value={values[name]} disabled={Boolean(busy)} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `profile-${name}-error` : undefined} className={controlClass} /> : (
        <div className="mt-1 min-h-14 break-words rounded-xl border border-white/70 bg-white/35 px-4 py-3 leading-8 text-gray-700 shadow-sm">{displayValue || t("তথ্য দেওয়া হয়নি", "Not provided")}</div>
      )}
      {editing && errors[name] && <p id={`profile-${name}-error`} role="alert" className="mt-1 text-sm text-red-700">{errorMessage(errors[name]!, isEnglish)}</p>}
    </div>;
  }
  return <>
    <div style={glassCard} className="overflow-hidden rounded-[2.5rem]">
      <section className="relative h-32 bg-linear-to-r from-orange-400/95 to-red-500/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_28%)]" />
        <div className="absolute -bottom-16 left-5 right-4 flex items-end gap-4 sm:left-10 sm:gap-6">
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full bg-white/75 p-1 shadow-2xl ring-1 ring-white/70 backdrop-blur-xl sm:h-36 sm:w-36">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-orange-100 text-4xl font-bold text-orange-500 sm:text-5xl">
                {avatar}
                {user.profileImg && <img key={user.profileImg} src={profileImageUrl(user.profileImg)} alt={user.fullName} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
              </div>
            </div>
            <input ref={photoInput} type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label={t("প্রোফাইল ছবি নির্বাচন করুন", "Choose profile photo")} onChange={(event) => { void uploadPhoto(event.target.files?.[0]); event.target.value = ""; }} />
            <button type="button" disabled={Boolean(busy)} onClick={() => photoInput.current?.click()} title={t("ছবি পরিবর্তন (JPG, PNG, WebP; সর্বোচ্চ ২ MB)", "Change photo (JPG, PNG, WebP; up to 2 MB)")} aria-label={t("প্রোফাইল ছবি পরিবর্তন", "Change profile photo")} className="absolute bottom-1 right-0 rounded-full border border-white/70 bg-white p-2 text-red-500 shadow-lg transition hover:bg-red-50 disabled:opacity-60 sm:bottom-2 sm:right-2">{busy === "photo" ? <LoaderCircle size={20} className="animate-spin" /> : <Camera size={20} />}</button>
          </div>
          <div className="mb-4 min-w-0">
            <h2 className="break-words text-xl font-bold sm:text-3xl">{user.fullName}</h2>
            <p className="break-words font-medium text-gray-600">{t("আইডি", "ID")}: {user.studentId}</p>
          </div>
        </div>
      </section>
      <div className="mt-20 px-6 sm:px-10">
        <p className="text-sm text-gray-600">{t("ছবি পরিবর্তন করতে ক্যামেরা আইকনে চাপুন। JPG, PNG বা WebP; সর্বোচ্চ ২ MB।", "Use the camera icon to change your photo. JPG, PNG or WebP; up to 2 MB.")}</p>
        {errors.photo && <p role="alert" className="mt-2 text-sm text-red-700">{errorMessage(errors.photo, isEnglish)}</p>}
      </div>
      <section className="border-b border-white/60 px-6 py-6 sm:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: t("মোট পয়েন্ট", "Total Points"), value: 1250, color: "text-orange-500" },
            { label: t("অর্জিত ব্যাজ", "Earned Badges"), value: 8, color: "text-red-500" },
            { label: t("কুইজ সম্পন্ন", "Quizzes Completed"), value: 24, color: "text-green-500" },
            { label: t("অর্জিত সার্টিফিকেট", "Certificates Earned"), value: 2, color: "text-blue-500" },
          ].map((stat) => <div key={stat.label} className="rounded-2xl border border-white/60 bg-white/35 p-3 text-center shadow-sm"><p className="text-xs font-bold text-gray-500">{stat.label}</p><p className={`text-2xl font-black ${stat.color}`}>{new Intl.NumberFormat(locale, { useGrouping: false, minimumIntegerDigits: 2 }).format(stat.value)}</p></div>)}
        </div>
      </section>
      <div className="mt-4 flex gap-6 border-b border-white/55 px-6 sm:px-10">
        {[{ tab: "general", label: t("ব্যক্তিগত তথ্য", "General Information") }, { tab: "badges", label: t("পুরস্কার ও ব্যাজ", "Earned Badges") }].map(({ tab, label }) => <button type="button" key={tab} disabled={editing || Boolean(busy)} onClick={() => setActiveTab(tab as "general" | "badges")} className={`py-4 ${activeTab === tab ? "border-b-4 border-red-500 font-bold text-red-600" : "font-medium text-gray-500"}`}>{label}</button>)}
      </div>
      <form ref={form} onSubmit={submit} noValidate className="p-6 md:p-10">
        {activeTab === "general" ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-700"><span className="h-6 w-2 rounded-full bg-red-500" />{t("সাধারণ তথ্য", "General Information")}</h3>
            {field(general[0].name, general[0].label)}
            <div>
              <label htmlFor="profile-email" className="ml-1 text-sm font-semibold text-gray-600">{t("ইমেইল", "Email")}</label>
              {editing ? (
                <input id="profile-email" name="email" type="email" value={user.email} disabled className={`${controlClass} cursor-not-allowed border-gray-200`} />
              ) : (
                <div className="mt-1 min-h-14 break-words rounded-xl border border-white/70 bg-white/35 px-4 py-3 leading-8 text-gray-700 shadow-sm">{user.email}</div>
              )}
            </div>
            {general.slice(1).map((item) => field(item.name, item.label))}
          </div>
          <div className="space-y-5"><h3 className="flex items-center gap-2 text-lg font-bold text-gray-700"><span className="h-6 w-2 rounded-full bg-orange-500" />{t("শিক্ষাপ্রতিষ্ঠান ও ঠিকানা", "School & Address")}</h3>{address.map((item) => field(item.name, item.label))}</div>
        </div> : <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{[
          { name: t("দ্রুত শিক্ষার্থী", "Fast Learner"), icon: "⚡", desc: t("৫টি কুইজ দ্রুত শেষ করা", "Completed 5 quizzes quickly") },
          { name: t("সেরা বন্ধু", "Best Friend"), icon: "🤝", desc: t("বন্ধুদের সাহায্য করা", "Helped friends") },
          { name: t("গণিত মাস্টার", "Math Master"), icon: "📐", desc: t("গণিতে ১০০% পাওয়া", "Scored 100% in Math") },
          { name: t("সাপ্তাহিক হিরো", "Weekly Hero"), icon: "🏆", desc: t("টপ চার্টে থাকা", "Ranked in the top chart") },
        ].map((badge) => <div key={badge.name} className="rounded-3xl border border-dashed border-white/65 bg-white/35 p-4 text-center"><div className="mb-2 text-4xl">{badge.icon}</div><h4 className="text-sm font-bold">{badge.name}</h4><p className="text-xs text-gray-500">{badge.desc}</p></div>)}</div>}
        {errors.root && <p role="alert" className="mt-5 text-sm text-red-700">{errorMessage(errors.root, isEnglish)}</p>}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/55 pt-8 lg:flex-row">
          <button type="button" disabled={Boolean(busy)} onClick={() => void logout()} className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-red-500 hover:bg-white/60"><LogOut size={20} />{t("লগ আউট করুন", "Logout")}</button>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            {/* Distinct keys prevent an Edit click from activating a reused Save submit button. */}
            {editing ? (
              <>
                <button key="profile-cancel" type="button" disabled={Boolean(busy)} onClick={cancelEditing} className={secondaryClass}>{t("বাতিল", "Cancel")}</button>
                <button key="profile-save" type="submit" disabled={Boolean(busy)} className={`${primaryClass} whitespace-nowrap`}>{busy === "profile" ? t("সেভ হচ্ছে...", "Saving...") : t("সেভ করুন", "Save")}</button>
              </>
            ) : (
              <>
                <button key="profile-password" type="button" disabled={Boolean(busy)} onClick={() => setPasswordOpen(true)} className={secondaryClass}>{t("পাসওয়ার্ড পরিবর্তন", "Change Password")}</button>
                <button key="profile-edit" type="button" disabled={Boolean(busy)} onClick={startEditing} className={primaryClass}>{t("তথ্য এডিট করুন", "Edit Information")}</button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
    {passwordOpen && <PasswordDialog isEnglish={isEnglish} onClose={() => setPasswordOpen(false)} />}
  </>;
}

export default function ProfilePage({ isEnglish = false }: { isEnglish?: boolean }) {
  const { user, isAuthenticated, isLoading, error, reloadUser } = useAuth();
  const t = (bn: string, en: string) => isEnglish ? en : bn;
  return <div className="relative min-h-screen overflow-hidden pb-12 text-gray-800 antialiased" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center bottom", fontFamily: "'Noto Sans Bengali', sans-serif" }}>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.40),rgba(219,234,254,0.18),rgba(255,255,255,0.46))]" />
    <TopNav title={t("প্রোফাইল", "Profile")} brandName={t("মেট ক্লাব", "Met Club")} />
    <main className="relative z-10 mx-auto mt-10 max-w-5xl px-4">
      {user ? <UserProfile key={user.id} user={user} isEnglish={isEnglish} /> : <div role={error ? "alert" : "status"} className="rounded-3xl p-8 text-center" style={glassCard}>
        <p>{!isAuthenticated ? t("ব্যক্তিগত তথ্য দেখতে লগইন করুন।", "Log in to view your personal information.") : isLoading ? t("প্রোফাইল লোড হচ্ছে...", "Loading your profile...") : t("প্রোফাইল লোড করা যায়নি। আবার চেষ্টা করুন।", "Your profile could not be loaded. Please try again.")}</p>
        {!isAuthenticated ? <Link to={isEnglish ? "/en/login" : "/login"} className={`${primaryClass} mt-4 inline-block`}>{t("লগইন করুন", "Login")}</Link> : !isLoading && <button type="button" onClick={() => void reloadUser()} className={`${primaryClass} mt-4`}>{t("আবার চেষ্টা করুন", "Try again")}</button>}
      </div>}
    </main>
  </div>;
}
