export type UserRole = "customer" | "admin";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export const demoProfile: Profile = {
  id: "demo-user",
  email: "customer@keyhub.dev",
  fullName: "KeyHub Customer",
  role: "customer",
};
