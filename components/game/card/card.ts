export const CardTypes = ["heart", "diamond", "spade", "club"] as const;
export type CardType = (typeof CardTypes)[number];

export const CardValues = ["7", "8", "9", "10", "J", "Q", "K", "A"] as const;
export type CardValue = (typeof CardValues)[number];

export type Card = { value: CardValue; type: CardType };

export const NonTrumpValues = {
  "7": 0,
  "8": 0,
  "9": 0,
  J: 2,
  Q: 3,
  K: 4,
  "10": 10,
  A: 11,
} as const;

export const TrumpValues = {
  "7": 0,
  "8": 0,
  Q: 3,
  K: 4,
  "10": 10,
  A: 11,
  "9": 14,
  J: 20,
} as const;

export const TypeValueMap = {
  heart: "❤",
  diamond: "♦",
  spade: "♤",
  club: "♧",
} as const satisfies { [key in CardType]: string };

export function getId(Card: Card) {
  return `${Card.type}${Card.value}`;
}
