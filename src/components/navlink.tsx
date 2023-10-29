import React from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-blue-900 hover:text-white"
  >
    {children}
  </Link>
);

export default NavLink;
