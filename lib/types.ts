// Type definitions for the competences game

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface Room {
  code: string;
  name: string;
  players: Player[];
  currentLevel: string | null;
  state: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export interface GameSession {
  roomCode: string;
  playerId: string;
  answers: Answer[];
  startTime: Date;
  endTime?: Date;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  timestamp: Date;
}