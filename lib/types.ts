export type SlotType = "A" | "O" | "C" | "E";

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Level = {
  id: string;
  slots: Record<SlotType, Option[]>;
  template: string;
};

export type Player = {
  id: string;
  name: string;
  score?: number;
  done?: boolean;
};

export type Room = {
  _id?: any;
  code: string;
  status: "lobby" | "playing" | "ended";
  hostId: string;
  players: Player[];
  level: Level;
  createdAt: string | Date;
  expiresAt: string | Date;
  startAt?: string | Date;
  endAt?: string | Date;
};
