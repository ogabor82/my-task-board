import logo from "../../../../resources/Logo.svg";

export default function LogoIcon({ className = "h-6 w-6", alt = "" }) {
  return <img src={logo} alt={alt} className={className} aria-hidden={alt ? undefined : true} />;
}
