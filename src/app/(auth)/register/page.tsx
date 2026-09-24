import { RegisterForm } from "@/components/auth/RegisterForm"
import { AuthLogo } from "@/components/auth/AuthLogo"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-[360px] flex-col gap-6">
        <AuthLogo />
        <RegisterForm />
      </div>
    </div>
  )
}

