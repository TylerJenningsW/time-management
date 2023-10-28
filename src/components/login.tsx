// test
import { signIn, signOut, useSession } from "next-auth/react";
import AuthButton from "./authButton";
export default function LoginButton() {
  const session = useSession();
  
  const isLoggedIn = !!session.data;

  if (isLoggedIn) {
    return (
      <>
      <AuthButton
        onClick={() => void signOut()}
        >
        Sign out
      </AuthButton>
    </>
    );
  } else {
    return (
      <>
        <AuthButton
          onClick={() => void signIn()}
        >
          Sign in
        </AuthButton>
      </>
    );
  }
}
