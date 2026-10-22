import { MILESTONES, PRIZES } from './data';

// reason: 'wrong' | 'timeout' | 'quit' | 'win'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'quit') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[Math.max(...passed) - 1];
};