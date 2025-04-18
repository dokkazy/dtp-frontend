import { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Đăng ký tài khoản mới.",
};


export default function RegisterPage() {
  return <RegisterForm />;
}
