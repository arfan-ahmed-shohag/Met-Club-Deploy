import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import bgImage from "../../assets/images/bg.png";
import axiosPublic from "../../hooks/axiosPublic";
import { getLocalizedPath } from "../../utils/language";
import { getExternalRedirect, redirectSearch } from "../../utils/gameRedirect";
import bangladeshLocations from "../../data/bangladesh-locations.json";
import { isAxiosError } from "axios";
import TopNav from "../../components/Shared/TopBar";
import { setSessionToken } from "../../lib/authSession";
import { transliterateBanglaLocation } from "../../utils/banglaTransliteration";
import {
  normalizeEmail,
  normalizeName,
  normalizePhone,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../../utils/userValidation";

export interface IUser {
  fullName: string;
  email: string;
  institution: string;
  class: number;
  guardianPhone: string;
  password: string;
  division?: string;
  district?: string;
  thana?: string;
  profileImg?: string;
}

type RegistrationFormValues = IUser & {
  division: string;
  district: string;
  thana: string;
  confirmPassword: string;
};

const controlClassName =
  "h-14 w-full min-w-0 rounded-2xl border bg-white px-4 py-2 text-base leading-8 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-red-100";

export default function Registration() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const isEnglish = pathname.startsWith("/en/");
  const t = (bengali: string, english: string) => (isEnglish ? english : bengali);
  const errorText = (field: string, message?: string) => {
    if (!isEnglish) return message;
    const messages: Record<string, string> = {
      fullName: "Enter a valid name.", email: "Enter a valid email address.",
      institution: "Enter an institution name (2–200 characters).", class: "Select a valid class.",
      guardianPhone: isOtherLocation ? "Enter a valid international phone number, including country code." : "Enter a valid 11-digit Bangladesh mobile number.",
      division: "Select a valid division.", district: "Select a district in the chosen division.",
      thana: "Select a thana or upazila in the chosen district.", password: "Use a valid password with at least 8 characters.",
      confirmPassword: "Passwords do not match.",
    };
    return messages[field] ?? "Please check this field and try again.";
  };
  const axios = axiosPublic();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      division: "",
      district: "",
      thana: "",
      confirmPassword: "",
    },
  });

  const divisionId = useWatch({ control, name: "division" });
  const districtId = useWatch({ control, name: "district" });
  const isOtherLocation = divisionId === "others";
  const selectedDivision = bangladeshLocations.find(
    (division) => division.id === divisionId,
  );
  const districts = selectedDivision?.districts ?? [];
  const selectedDistrict = districts.find(
    (district) => district.id === districtId,
  );
  const thanas = selectedDistrict?.thanas ?? [];

  const onSubmit = async (data: RegistrationFormValues) => {
    const payload: IUser = {
      fullName: normalizeName(data.fullName),
      email: normalizeEmail(data.email),
      institution: normalizeName(data.institution),
      class: Number(data.class),
      guardianPhone: normalizePhone(data.guardianPhone),
      password: data.password,
      division: isOtherLocation ? "Others" : selectedDivision?.name,
      district: isOtherLocation ? "Others" : selectedDistrict?.name,
      thana: isOtherLocation ? "Others" : data.thana,
      profileImg: data.profileImg?.trim() || undefined,
    };
    try {
      const res = await axios.post("/user", {
        ...payload,
        confirmPassword: data.confirmPassword,
      });
      if (!res.data.success)
        throw new Error(res.data.errorMessage || "নিবন্ধন ব্যর্থ হয়েছে।");
      setSessionToken(res.data.data.accessToken);
      toast.success(t("নিবন্ধন সফল! এখন যাত্রা শুরু করুন।", "Registration successful! Start your learning journey."), { id: "registration" });
      // Players sent here by the game go straight back to it.
      const externalRedirect = getExternalRedirect(search);
      if (externalRedirect) {
        window.location.assign(externalRedirect);
        return;
      }
      navigate(getLocalizedPath("/", isEnglish ? "en" : "bn"));
    } catch (error) {
      const fieldErrors = isAxiosError(error)
        ? error.response?.data.errors
        : undefined;
      const fields = [
        "fullName",
        "email",
        "institution",
        "class",
        "guardianPhone",
        "division",
        "district",
        "thana",
        "password",
        "confirmPassword",
      ] as const;
      let hasFieldError = false;
      for (const field of fields) {
        if (typeof fieldErrors?.[field] === "string") {
          setError(
            field,
            { type: "server", message: fieldErrors[field] },
            { shouldFocus: !hasFieldError },
          );
          hasFieldError = true;
        }
      }
      if (!hasFieldError) {
        const message = isAxiosError(error)
          ? error.response?.data.errorMessage ||
            "সংযোগ করা যায়নি। আবার চেষ্টা করুন।"
          : error instanceof Error
            ? error.message
            : "নিবন্ধন ব্যর্থ হয়েছে।";
        setError("root.server", { message });
      }
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-20 text-black">
        <TopNav title={isEnglish ? "Registration" : "নিবন্ধন"} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(140deg, rgba(127,29,29,0.38) 0%, rgba(185,28,28,0.26) 45%, rgba(249,115,22,0.22) 100%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/18 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 md:px-12">
        <div
          className="relative w-full max-w-4xl rounded-4xl p-6 sm:p-8 md:p-10 text-white backdrop-blur-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow:
              "0 24px 80px rgba(127,29,29,0.34), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <div className="mb-8 flex flex-col gap-3">
            <div className="inline-flex w-fit rounded-full bg-white/20 px-4 py-1 text-xs font-bold tracking-[0.18em] text-white border border-white/30">
              {t("নতুন সদস্য নিবন্ধন", "NEW MEMBER REGISTRATION")}
            </div>
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              {t("মেট ক্লাবে আপনার প্রোফাইল তৈরি করুন", "Create your MET Club profile")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              {t("আপনার তথ্য দিন, তারপর শেখা ও খেলার যাত্রা শুরু করুন।", "Enter your details to begin your learning journey.")}
            </p>
          </div>

          <form
            noValidate
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("শিক্ষার্থীর নাম", "Student name")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  autoComplete="name"
                  placeholder={t("পূর্ণ নাম লিখুন", "Enter your full name")}
                  {...register("fullName", {
                    setValueAs: normalizeName,
                    validate: validateName,
                  })}
                  className={`${controlClassName} ${errors.fullName ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errorText("fullName", errors.fullName.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("ইমেইল ঠিকানা", "Email address")}
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="example@mail.com"
                  {...register("email", {
                    setValueAs: normalizeEmail,
                    validate: validateEmail,
                  })}
                  className={`${controlClassName} ${errors.email ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errorText("email", errors.email.message)}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="institution"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  {t("স্কুল / প্রতিষ্ঠান", "School / Institution")}
                </label>
                <input
                  type="text"
                  id="institution"
                  placeholder={t("স্কুলের নাম লিখুন", "Enter your school name")}
                  {...register("institution", {
                    setValueAs: normalizeName,
                    required: "প্রতিষ্ঠানের নাম আবশ্যক",
                    minLength: {
                      value: 2,
                      message: "প্রতিষ্ঠানের নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                    },
                    maxLength: {
                      value: 200,
                      message: "প্রতিষ্ঠানের নাম সর্বোচ্চ ২০০ অক্ষরের হতে পারবে",
                    },
                  })}
                  className={`${controlClassName} ${errors.institution ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                />
                {errors.institution && (
                  <p className="mt-1 text-xs text-red-500">
                    {errorText("institution", errors.institution.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("শ্রেণি", "Class")}
                </label>
                <div className="relative">
                  <select
                    id="class"
                    {...register("class", {
                      required: "শ্রেণি নির্বাচন করুন",
                      valueAsNumber: true,
                    })}
                    defaultValue=""
                    className={`${controlClassName} appearance-none pr-12 ${errors.class ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  >
                    <option value="" disabled>
                      {t("শ্রেণি নির্বাচন করুন", "Select your class")}
                    </option>
                    <option value="1">{t("শ্রেণি 1", "Class 1")}</option>
                    <option value="2">{t("শ্রেণি 2", "Class 2")}</option>
                    <option value="3">{t("শ্রেণি 3", "Class 3")}</option>
                    <option value="4">{t("শ্রেণি 4", "Class 4")}</option>
                    <option value="5">{t("শ্রেণি 5", "Class 5")}</option>
                    <option value="6">{t("শ্রেণি 6", "Class 6")}</option>
                    <option value="7">{t("শ্রেণি 7", "Class 7")}</option>
                    <option value="8">{t("শ্রেণি 8", "Class 8")}</option>
                    <option value="9">{t("শ্রেণি 9", "Class 9")}</option>
                    <option value="10">{t("শ্রেণি 10", "Class 10")}</option>
                    <option value="11">{t("শ্রেণি 11", "Class 11")}</option>
                    <option value="12">{t("শ্রেণি 12", "Class 12")}</option>
                    <option value="0">{t("অন্যান্য", "Other")}</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
                {errors.class && (
                  <p className="mt-1 text-xs text-red-500">
                      {errorText("class", errors.class.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="division"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("বিভাগ", "Division")}
                </label>
                <div className="relative">
                  <select
                    id="division"
                    aria-invalid={Boolean(errors.division)}
                    aria-describedby={
                      errors.division ? "division-error" : undefined
                    }
                    {...register("division", {
                      required: "বিভাগ নির্বাচন করুন",
                      validate: (value) =>
                        value === "others" || bangladeshLocations.some(
                          (division) => division.id === value,
                        ) || "তালিকা থেকে বিভাগ নির্বাচন করুন",
                      onChange: (event) => {
                        const other = event.target.value === "others";
                        setValue("district", other ? "Others" : "");
                        setValue("thana", other ? "Others" : "");
                        clearErrors(["district", "thana"]);
                      },
                    })}
                    className={`${controlClassName} appearance-none pr-12 ${errors.division ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  >
                    <option value="" disabled>
                      {t("বিভাগ নির্বাচন করুন", "Select a division")}
                    </option>
                    {bangladeshLocations.map((division) => (
                      <option key={division.id} value={division.id}>
                        {isEnglish ? transliterateBanglaLocation(division.name) : division.name}
                      </option>
                    ))}
                    <option value="others">{t("অন্যান্য", "Other")}</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
                {errors.division && (
                  <p id="division-error" className="mt-1 text-xs text-red-500">
                    {errorText("division", errors.division.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("জেলা", "District")}
                </label>
                <div className="relative">
                  <select
                    id="district"
                    disabled={!selectedDivision && !isOtherLocation}
                    aria-invalid={Boolean(errors.district)}
                    aria-describedby={
                      errors.district ? "district-error" : undefined
                    }
                    {...register("district", {
                      required: "জেলা নির্বাচন করুন",
                      validate: (value) =>
                        (isOtherLocation ? value === "Others" : districts.some((district) => district.id === value)) ||
                        "নির্বাচিত বিভাগের জেলা নির্বাচন করুন",
                      onChange: (event) => {
                        setValue("thana", isOtherLocation && event.target.value === "Others" ? "Others" : "");
                        clearErrors("thana");
                      },
                    })}
                    className={`${controlClassName} appearance-none pr-12 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${errors.district ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  >
                    <option value="" disabled>
                      {selectedDivision
                        ? t("জেলা নির্বাচন করুন", "Select a district")
                        : t("আগে বিভাগ নির্বাচন করুন", "Select a division first")}
                    </option>
                    {isOtherLocation && <option value="Others">{t("অন্যান্য", "Other")}</option>}
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {isEnglish ? transliterateBanglaLocation(district.name) : district.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
                {errors.district && (
                  <p id="district-error" className="mt-1 text-xs text-red-500">
                    {errorText("district", errors.district.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="thana"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("থানা / উপজেলা", "Thana / Upazila")}
                </label>
                <div className="relative">
                  <select
                    id="thana"
                    disabled={!selectedDistrict && !isOtherLocation}
                    aria-invalid={Boolean(errors.thana)}
                    aria-describedby={errors.thana ? "thana-error" : undefined}
                    {...register("thana", {
                      required: "থানা / উপজেলা নির্বাচন করুন",
                      validate: (value) =>
                        (isOtherLocation ? value === "Others" : thanas.includes(value)) ||
                        "নির্বাচিত জেলার থানা / উপজেলা নির্বাচন করুন",
                    })}
                    className={`${controlClassName} appearance-none pr-12 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${errors.thana ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  >
                    <option value="" disabled>
                      {selectedDistrict
                        ? t("থানা / উপজেলা নির্বাচন করুন", "Select a thana / upazila")
                        : t("আগে জেলা নির্বাচন করুন", "Select a district first")}
                    </option>
                    {isOtherLocation && <option value="Others">{t("অন্যান্য", "Other")}</option>}
                    {thanas.map((thana) => (
                      <option key={thana} value={thana}>
                        {isEnglish ? transliterateBanglaLocation(thana) : thana}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
                {errors.thana && (
                  <p id="thana-error" className="mt-1 text-xs text-red-500">
                    {errorText("thana", errors.thana.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="guardianPhone"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("মোবাইল নম্বর", "Mobile number")}
                </label>
                <input
                  type="tel"
                  id="guardianPhone"
                  autoComplete="tel"
                  placeholder={isOtherLocation ? "+8801XXXXXXXXX" : "01XXXXXXXXX"}
                  {...register("guardianPhone", {
                    setValueAs: normalizePhone,
                    validate: (value) => {
                      if (!isOtherLocation) return validatePhone(value);
                      const phone = value.trim().replace(/[\s()-]/g, "");
                      return /^\+[1-9]\d{7,14}$/.test(phone) || t("সঠিক আন্তর্জাতিক ফোন নম্বর ও কান্ট্রি কোড দিন", "Enter a valid international phone number, including country code.");
                    },
                  })}
                  className={`${controlClassName} ${errors.guardianPhone ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                />
                {errors.guardianPhone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errorText("guardianPhone", errors.guardianPhone.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("পাসওয়ার্ড", "Password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    placeholder={t("কমপক্ষে ৮ অক্ষর", "At least 8 characters")}
                    {...register("password", {
                      validate: validatePassword,
                      deps: ["confirmPassword"],
                    })}
                    className={`${controlClassName} pr-12 ${errors.password ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? t("পাসওয়ার্ড লুকান", "Hide password") : t("পাসওয়ার্ড দেখুন", "Show password")
                    }
                    aria-pressed={showPassword}
                    aria-controls="password"
                    className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-r-2xl text-slate-500 transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red-400"
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errorText("password", errors.password.message)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-normal text-white"
                >
                  {t("পাসওয়ার্ড নিশ্চিত করুন", "Confirm password")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    placeholder={t("পাসওয়ার্ড আবার লিখুন", "Enter your password again")}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    {...register("confirmPassword", {
                      required: "পাসওয়ার্ড আবার লিখুন",
                      validate: (value, values) =>
                        value === values.password || "পাসওয়ার্ড দুটি মিলছে না",
                    })}
                    className={`${controlClassName} pr-12 ${errors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-red-100 focus:border-red-400"}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? t("নিশ্চিত পাসওয়ার্ড লুকান", "Hide confirmed password")
                        : t("নিশ্চিত পাসওয়ার্ড দেখুন", "Show confirmed password")
                    }
                    aria-pressed={showConfirmPassword}
                    aria-controls="confirmPassword"
                    className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-r-2xl text-slate-500 transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="mt-1 text-xs text-red-500"
                  >
                    {errorText("confirmPassword", errors.confirmPassword.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/35 bg-white/12 px-4 py-3 text-sm leading-6 text-white/95">
              {t("আবহাওয়া, জলবায়ু ও দুর্যোগ বিষয়ে শেখার জন্য এই প্রোফাইল ব্যবহার হবে। প্রদত্ত তথ্য সঠিকভাবে পূরণ করুন.", "This profile will be used for learning about weather, climate, and disasters. Please make sure your information is correct.")}
            </div>

            <div className="space-y-6 pt-2">
              {errors.root?.server && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {isEnglish ? "Registration could not be completed. Please check your details and try again." : errors.root.server.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full whitespace-nowrap text-white cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-xl text-sm px-5 py-3 text-center disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95"
              >
                {isSubmitting ? t("অপেক্ষা করুন...", "Please wait...") : t("নিবন্ধন সম্পন্ন করুন", "Create account")}
              </button>
              <p className="text-sm font-normal text-slate-700 text-center">
                {t("অ্যাকাউন্ট আছে?", "Already have an account?")}{" "}
                <Link
                  to={`${getLocalizedPath("/login", isEnglish ? "en" : "bn")}${redirectSearch(getExternalRedirect(search))}`}
                  className="font-semibold text-red-700 hover:text-red-800 hover:underline"
                >
                  {t("লগইন করুন", "Log in")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
