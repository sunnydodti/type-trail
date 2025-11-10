import type { TextCharStatus } from "../enums/TextCharStatus";

export interface TextCharData {
  character: string;
  isCurrent: boolean;
  status: TextCharStatus;
}
