import Image from "next/image";

import logo from "../../../public/logo.png";
import NavLink from "./navlink";
function Logo() {
  return (
    <NavLink href="/">
      <Image width={40} height={40} alt="time" src={logo}></Image>
    </NavLink>
  );
}

export default Logo;
