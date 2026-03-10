import addRoundDuotone from "../../../../resources/Add_round_duotone.svg";

export default function AddRoundDuotoneIcon({ className = "h-6 w-6", alt = "" }) {
  return (
    <img
      src={addRoundDuotone}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
    />
  );
}
