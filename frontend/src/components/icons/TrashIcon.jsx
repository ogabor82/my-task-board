import trash from "../../../../resources/Trash.svg";

export default function TrashIcon({ className = "h-5 w-5", alt = "" }) {
  return <img src={trash} alt={alt} className={className} aria-hidden={alt ? undefined : true} />;
}
