export type AuthUserType = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  profilePicture: string | null;
  createdAt: string;
  accessToken?: string;
};
