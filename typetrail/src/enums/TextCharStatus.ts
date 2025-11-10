export const TextCharStatus = {
  pending: 0,
  correct: 1,
  wrong: 2,
} as const;

export type TextCharStatus =
  (typeof TextCharStatus)[keyof typeof TextCharStatus];
