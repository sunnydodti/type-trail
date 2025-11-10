import { TextCharStatus } from "./enums/TextCharStatus";

export function getTextCharacterStatusClassName(
  status: TextCharStatus
): string {
  switch (status) {
    case TextCharStatus.pending:
      return "text-character-pending";
    case TextCharStatus.correct:
      return "text-character-correct";
    case TextCharStatus.wrong:
      return "text-character-incorrect";
  }
}
