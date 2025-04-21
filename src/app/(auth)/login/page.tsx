import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn.",
};

export default async function LoginPage() {
  return <LoginForm />;
}
