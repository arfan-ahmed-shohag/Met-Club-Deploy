// The API flattens the account (User) and its role profile (Student or
// Admin) into one object. Student-only fields are null for admins.
export interface CurrentUser {
  id: string;
  fullName: string;
  studentId: string | null;
  email: string;
  institution: string | null;
  class: number | null;
  guardianPhone: string | null;
  division: string | null;
  district: string | null;
  thana: string | null;
  profileImg: string | null;
  role: "student" | "admin";
}
