import Image from 'next/image'

import logo from '../../../public/logo.png'
function Logo() {
  return (
    <Image width={40} height={40} alt="time" src={logo}></Image>
  )
}

export default Logo;
