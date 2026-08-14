import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <span className="text-sm font-bold">TZ</span>
          </div>
          <span className="text-xl font-bold">Tumbados Zumba</span>
        </Link>
        <RegisterForm />
      </div>
    </div>
  )
}

