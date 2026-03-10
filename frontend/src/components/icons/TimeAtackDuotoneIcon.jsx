import timeAtackDuotone from "../../../../resources/Time_atack_duotone.svg";

export default function TimeAtackDuotoneIcon({ className = "h-5 w-5", alt = "" }) {
  return (
    <img
      src={timeAtackDuotone}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
    />
  );
}
