import ForgotPasswordForm from "./forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Quên mật khẩu",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
