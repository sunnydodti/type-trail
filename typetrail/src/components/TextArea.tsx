import { TextCharStatus } from "../enums/TextCharStatus";
import type { TextData as TextData } from "../types/TextData";
import TextCharacter from "./TextCharacter/TextCharacter";

export default function TextArea(input: TextData) {
  return (
    <div>
      {[...input.text].map((char, index) =>
        getTextCharacter(char, index, input)
      )}
    </div>
  );

  function getTextCharacter(char: string, index: number, input: TextData) {
    let status: TextCharStatus = TextCharStatus.pending;

    if (index < input.currentIndex) {
      status = input.errors.includes(index)
        ? TextCharStatus.wrong
        : TextCharStatus.correct;
    }
    return (
      <TextCharacter
        isCurrent={index === input.currentIndex}
        key={index}
        character={char}
        status={status}
      />
    );
  }
}
