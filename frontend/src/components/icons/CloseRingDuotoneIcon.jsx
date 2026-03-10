import closeRingDuotone from "../../../../resources/close_ring_duotone.svg";

export default function CloseRingDuotoneIcon({ className = "h-5 w-5", alt = "" }) {
  return (
    <img
      src={closeRingDuotone}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
    />
  );
}
