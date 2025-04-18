import { Metadata } from "next";
import Profile from "./Profile";


export const metadata: Metadata = {
  title: "Trang cá nhân",
};

export default async function ProfilePage() {
  return <Profile />;
}
