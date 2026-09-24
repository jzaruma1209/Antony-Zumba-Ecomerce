"use client"

import Image from "next/image"
import Link from "next/link"

const LOGO_LIGHT = "https://res.cloudinary.com/dxkmtbde/image/upload/v1789965816/basictech/media/general/k3h6czmntzzzyszyr2qo.png"
const LOGO_DARK = "https://res.cloudinary.com/dxkmtbde/image/upload/v1789965818/basictech/media/general/g5rzjsazgmqctvgjlky9.png"

export function AuthLogo() {
  return (
    <Link href="/" className="flex items-center justify-center self-center">
      <Image
        src={LOGO_LIGHT}
        alt="Tumbados Zumba"
        width={200}
        height={60}
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src={LOGO_DARK}
        alt="Tumbados Zumba"
        width={200}
        height={60}
        className="object-contain hidden dark:block"
        priority
      />
    </Link>
  )
}
