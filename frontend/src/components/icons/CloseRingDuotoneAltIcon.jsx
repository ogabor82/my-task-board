import closeRingDuotoneAlt from "../../../../resources/close_ring_duotone-1.svg";

export default function CloseRingDuotoneAltIcon({ className = "h-5 w-5", alt = "" }) {
  return (
    <img
      src={closeRingDuotoneAlt}
      alt={alt}
      className={className}
      aria-hidden={alt ? undefined : true}
    />
  );
}
