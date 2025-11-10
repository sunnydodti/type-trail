import type { TextCharData } from "../../types/TextCharData";
import { getTextCharacterStatusClassName } from "../../util";
import "./TextCharacter.css";

const TextCharacter = (data: TextCharData) => {
  let className: string = getTextCharacterStatusClassName(data.status);
  if (data.isCurrent) className += " text-character-current";
  return <span className={className}>{data.character}</span>;
};

export default TextCharacter;
