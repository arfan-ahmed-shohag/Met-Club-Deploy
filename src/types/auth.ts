export interface CurrentUser {
    id: string;
    fullName: string;
    studentId: string;
    email: string;
    institution: string;
    class: number;
    guardianPhone: string;
    division: string | null;
    district: string | null;
    thana: string | null;
    profileImg: string | null;
    role: "student" | "admin";
}
