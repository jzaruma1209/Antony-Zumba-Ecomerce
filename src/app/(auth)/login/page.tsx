import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { AuthLogo } from "@/components/auth/AuthLogo"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-[360px] flex-col gap-6">
        <AuthLogo />
        <Suspense fallback={<div className="text-center">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

