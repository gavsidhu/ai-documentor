import Image from "next/image";

const Logo = ({ className = '', ...props }) => (
  <Image
    src="/optibot-full-logo.png"
    alt="Optibot logo"
    width={75}
    height={25}
  />
);

export default Logo;
