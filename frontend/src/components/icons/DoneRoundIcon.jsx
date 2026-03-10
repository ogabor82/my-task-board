import doneRound from "../../../../resources/Done_round.svg";

export default function DoneRoundIcon({ className = "h-5 w-5", alt = "" }) {
  return <img src={doneRound} alt={alt} className={className} aria-hidden={alt ? undefined : true} />;
}
