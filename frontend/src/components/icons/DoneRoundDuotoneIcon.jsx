import doneRoundDuotone from "../../../../resources/Done_round_duotone.svg";

export default function DoneRoundDuotoneIcon({ className = "h-5 w-5", alt = "" }) {
  return (
    <img
      src={doneRoundDuotone}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
    />
  );
}
