import editDuotone from "../../../../resources/Edit_duotone.svg";

export default function EditDuotoneIcon({ className = "h-5 w-5", alt = "" }) {
  return <img src={editDuotone} alt={alt} className={className} aria-hidden={alt ? undefined : true} />;
}
