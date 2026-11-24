import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
  Mail,
  PencilLine,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import type { CurrentUser } from "../../types/auth";
import {
  changePassword,
  profileImageUrl,
  saveProfile,
  saveProfilePhoto,
} from "../../lib/profile";
import {
  validatePasswordChange,
  validateProfilePhoto,
} from "../../utils/profileValidation";
import type { PasswordValues } from "../../utils/profileValidation";
import { normalizeName, validateName } from "../../utils/userValidation";

type FieldErrors = Record<string, string | undefined>;

const cardClass =
  "rounded-3xl border border-red-100/80 bg-white shadow-[0_10px_34px_rgba(64,48,45,0.07)]";
const inputClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-[15px] text-red-950 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60";
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-red-900 transition hover:bg-stone-50 disabled:opacity-60";

function requestErrors(error: unknown): FieldErrors {
  if (error instanceof Error && error.message === "Session changed") return {};
  if (isAxiosError(error) && error.response?.data?.errors)
    return error.response.data.errors;
  if (isAxiosError(error) && typeof error.response?.data?.message === "string")
    return { root: error.response.data.message };
  return { root: "আপডেট করা যায়নি। আবার চেষ্টা করুন।" };
}

function firstGrapheme(name: string) {
  return (
    Array.from(
      new Intl.Segmenter("bn", { granularity: "grapheme" }).segment(name.trim()),
    )[0]?.segment ?? "A"
  );
}

function CardHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-black text-red-950">{title}</h2>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function ErrorText({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

/** Banner with the photo, name and role, styled like the admin sidebar. */
function ProfileHero({ user }: { user: CurrentUser }) {
  const photoInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string>();

  async function uploadPhoto(file?: File) {
    if (!file) return;
    const invalid = validateProfilePhoto(file);
    setPhotoError(invalid ?? undefined);
    if (invalid) return;
    setUploading(true);
    try {
      await saveProfilePhoto(file);
      toast.success("প্রোফাইল ছবি আপডেট হয়েছে।");
    } catch (error) {
      const errors = requestErrors(error);
      setPhotoError(errors.photo ?? errors.root);
    } finally {
      setUploading(false);
      if (photoInput.current) photoInput.current.value = "";
    }
  }

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="relative h-32 overflow-hidden bg-[linear-gradient(322deg,#222221_2%,#40302d_97%)] sm:h-40">
        <span
          aria-hidden="true"
          className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-red-600/30 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-28 right-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[18px_18px]"
        />
      </div>

      <div className="relative flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative -mt-14 w-fit sm:-mt-16">
            <span className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-linear-to-br from-red-600 to-orange-500 text-4xl font-black text-white shadow-xl shadow-red-950/15 sm:h-32 sm:w-32">
              {firstGrapheme(user.fullName)}
              {user.profileImg && (
                <img
                  key={user.profileImg}
                  src={profileImageUrl(user.profileImg)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
              {uploading && (
                <span className="absolute inset-0 grid place-items-center bg-red-950/55">
                  <LoaderCircle className="h-7 w-7 animate-spin" />
                </span>
              )}
            </span>
            <button
              type="button"
              disabled={uploading}
              onClick={() => photoInput.current?.click()}
              aria-label="প্রোফাইল ছবি পরিবর্তন করুন"
              title="প্রোফাইল ছবি পরিবর্তন করুন"
              className="absolute -bottom-1 -right-1 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-red-600 text-white shadow-lg transition hover:bg-red-700 disabled:cursor-wait"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={photoInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => void uploadPhoto(event.target.files?.[0])}
            />
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-black tracking-tight text-red-950 sm:text-3xl">
                {user.fullName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">
                <BadgeCheck className="h-3.5 w-3.5" />
                অ্যাডমিন
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-stone-500">
              <Mail className="h-4 w-4 shrink-0" />
              {user.email}
            </p>
          </div>
        </div>

        <p className="text-xs text-stone-400 sm:pb-2 sm:text-right">
          JPG, PNG বা WebP · সর্বোচ্চ ২ MB
        </p>
      </div>
      {photoError && (
        <div className="px-6 pb-5">
          <ErrorText message={photoError} />
        </div>
      )}
    </section>
  );
}

/** Name is the only editable field for admins; email and role are read-only. */
function AccountCard({ user }: { user: CurrentUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setName(user.fullName);
    setErrors({});
    setEditing(true);
  };
  const cancel = () => {
    setName(user.fullName);
    setErrors({});
    setEditing(false);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = validateName(name);
    if (valid !== true) {
      setErrors({ fullName: valid });
      return;
    }
    const fullName = normalizeName(name);
    if (fullName === user.fullName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ fullName });
      toast.success("প্রোফাইল আপডেট হয়েছে।");
      setEditing(false);
    } catch (error) {
      setErrors(requestErrors(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={cardClass}>
      <CardHeader
        icon={<UserRound className="h-5 w-5" />}
        title="ব্যক্তিগত তথ্য"
        subtitle="আপনার অ্যাকাউন্টের মৌলিক তথ্য"
        action={
          !editing && (
            <button
              type="button"
              onClick={startEditing}
              className={`${secondaryButton} px-3.5 py-2`}
            >
              <PencilLine className="h-4 w-4" />
              সম্পাদনা
            </button>
          )
        }
      />
      <form noValidate onSubmit={submit} className="space-y-5 p-6">
        <div>
          <label
            htmlFor="admin-fullName"
            className="mb-1.5 block text-sm font-bold text-red-900"
          >
            পূর্ণ নাম
          </label>
          {editing ? (
            <>
              <input
                id="admin-fullName"
                name="fullName"
                autoComplete="name"
                autoFocus
                disabled={saving}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors({});
                }}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "admin-fullName-error" : undefined
                }
                className={inputClass}
              />
              <ErrorText id="admin-fullName-error" message={errors.fullName} />
            </>
          ) : (
            <p
              id="admin-fullName"
              className="rounded-xl border border-transparent bg-stone-50 px-4 py-3 text-[15px] font-semibold text-red-950"
            >
              {user.fullName}
            </p>
          )}
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-red-900">
            ইমেইল
            <Lock className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
          </p>
          <p className="truncate rounded-xl bg-stone-50 px-4 py-3 text-[15px] text-stone-600">
            {user.email}
          </p>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-bold text-red-900">ভূমিকা</p>
          <p className="flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-3 text-[15px] text-stone-600">
            <ShieldCheck className="h-4 w-4 text-red-600" aria-hidden="true" />
            সাইট অ্যাডমিন
          </p>
        </div>

        <ErrorText message={errors.root} />

        {editing && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-stone-100 pt-5">
            <button
              type="button"
              disabled={saving}
              onClick={cancel}
              className={secondaryButton}
            >
              বাতিল
            </button>
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

const emptyPasswords: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const passwordFields = [
  {
    name: "currentPassword",
    label: "বর্তমান পাসওয়ার্ড",
    autoComplete: "current-password",
  },
  { name: "newPassword", label: "নতুন পাসওয়ার্ড", autoComplete: "new-password" },
  {
    name: "confirmPassword",
    label: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    autoComplete: "new-password",
  },
] as const;

function SecurityCard() {
  const [values, setValues] = useState<PasswordValues>(emptyPasswords);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const dirty = Object.values(values).some(Boolean);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePasswordChange(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    try {
      await changePassword(values);
      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে।");
      setValues(emptyPasswords);
      setVisible({});
    } catch (error) {
      setErrors(requestErrors(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={cardClass}>
      <CardHeader
        icon={<KeyRound className="h-5 w-5" />}
        title="পাসওয়ার্ড পরিবর্তন"
        subtitle="অ্যাকাউন্ট সুরক্ষিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন"
      />
      <form noValidate onSubmit={submit} className="space-y-5 p-6">
        {passwordFields.map((field) => {
          const id = `admin-${field.name}`;
          const error = errors[field.name];
          return (
            <div key={field.name}>
              <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-bold text-red-900"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={id}
                  name={field.name}
                  type={visible[field.name] ? "text" : "password"}
                  autoComplete={field.autoComplete}
                  disabled={saving}
                  value={values[field.name]}
                  onChange={(event) => {
                    setValues({ ...values, [field.name]: event.target.value });
                    setErrors({ ...errors, [field.name]: undefined, root: undefined });
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisible({ ...visible, [field.name]: !visible[field.name] })
                  }
                  aria-label={`${field.label} ${visible[field.name] ? "লুকান" : "দেখান"}`}
                  aria-pressed={Boolean(visible[field.name])}
                  className="absolute inset-y-0 right-0 px-4 text-stone-400 transition hover:text-red-600"
                >
                  {visible[field.name] ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              <ErrorText id={`${id}-error`} message={error} />
            </div>
          );
        })}

        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100">
          নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে এবং বর্তমান পাসওয়ার্ড থেকে
          আলাদা হতে হবে।
        </p>

        <ErrorText message={errors.root} />

        <div className="flex flex-wrap justify-end gap-3 border-t border-stone-100 pt-5">
          {dirty && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setValues(emptyPasswords);
                setErrors({});
                setVisible({});
              }}
              className={secondaryButton}
            >
              মুছে ফেলুন
            </button>
          )}
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {saving ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div role="status" aria-label="প্রোফাইল লোড হচ্ছে" className="space-y-6">
      <div className={`${cardClass} overflow-hidden`}>
        <div className="h-32 animate-pulse bg-stone-200 motion-reduce:animate-none sm:h-40" />
        <div className="flex items-end gap-4 px-6 pb-6">
          <div className="-mt-14 h-28 w-28 animate-pulse rounded-3xl border-4 border-white bg-stone-200 motion-reduce:animate-none sm:h-32 sm:w-32" />
          <div className="space-y-2 pb-2">
            <div className="h-6 w-48 animate-pulse rounded-full bg-stone-200 motion-reduce:animate-none" />
            <div className="h-4 w-36 animate-pulse rounded-full bg-stone-100 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {[0, 1].map((key) => (
          <div
            key={key}
            className={`${cardClass} h-96 animate-pulse motion-reduce:animate-none`}
          />
        ))}
      </div>
    </div>
  );
}

/** Admin-only profile page rendered inside AdminLayout at /admin/profile. */
export default function AdminProfile() {
  const { user, isAuthenticated, isLoading, error, reloadUser } = useAuth();

  if (!user) {
    if (isAuthenticated && isLoading) return <ProfileSkeleton />;
    return (
      <div
        role={error ? "alert" : "status"}
        className={`${cardClass} mx-auto max-w-lg p-8 text-center`}
      >
        <p className="text-red-950">
          {!isAuthenticated
            ? "প্রোফাইল দেখতে লগইন করুন।"
            : "প্রোফাইল লোড করা যায়নি। আবার চেষ্টা করুন।"}
        </p>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => void reloadUser()}
            className={`${primaryButton} mt-5`}
          >
            আবার চেষ্টা করুন
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHero user={user} />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <AccountCard key={user.id} user={user} />
        <SecurityCard key={`security-${user.id}`} />
      </div>
    </div>
  );
}
