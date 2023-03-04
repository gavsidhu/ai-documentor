import LoginComp from "@/components/Login"
import { useSession } from "next-auth/react"

export default function Login() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    },
  })

  if (status === "loading") {
    return <LoginComp />
  }

  return "User is logged in"
}