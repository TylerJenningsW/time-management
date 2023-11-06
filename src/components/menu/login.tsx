import { signIn, signOut, useSession } from "next-auth/react";
import AuthButton from "./authButton";
export default function LoginButton() {
  const session = useSession();

  const isLoggedIn = !!session?.data?.user;

  if (isLoggedIn) {
    return (
      <>
        <AuthButton onClick={async () => await signOut()}>Sign out</AuthButton>
      </>
    );
  } else {
    return (
      <>
        <AuthButton onClick={async () => await signIn()}>Sign in</AuthButton>
      </>
    );
  }
}
