import React from "react";
import Logo from "./mainTitle";
import NavLink from "./navlink";
import LoginButton from "./login";


function Navbar() {
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
                <NavLink href="#">Home</NavLink>
                <NavLink href="#">Tasks</NavLink>
                <NavLink href="#">Calendar</NavLink>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
