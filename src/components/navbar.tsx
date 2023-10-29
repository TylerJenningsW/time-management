import React from "react";
import Logo from "./mainTitle";
import NavLink from "./navlink";
import LoginButton from "./login";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar() {
  const session = useSession();
  const isLoggedIn = true;

  return (
    <nav className="bg-blue-700">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/tasks">Tasks</NavLink>
                <NavLink href="/calendar">Calendar</NavLink>
                <LoginButton />
              </div>
            </div>
            <div className="ml-auto flex items-end justify-end gap-4">
              {isLoggedIn &&
                (session.data?.user.image ? (
                  <Image
                    alt="user's profile image"
                    src={session.data.user.image}
                    width={40}
                    height={40}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mb-3 ml-auto text-white"
                  />
                ))}
              <button className="mb-2 ml-auto text-white">Account</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
