import { Metadata } from "next";
import RegisterForm from "../components/forms/register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary/40">
      <RegisterForm />
    </div>
  );
}
