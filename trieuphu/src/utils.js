import { MILESTONES, PRIZES } from './data';

// reason: 'wrong' | 'timeout' | 'quit' | 'win'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'quit') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[Math.max(...passed) - 1];
};

// Chọn ngẫu nhiên `count` phần tử từ mảng
export const pickRandom = (arr, count) => {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(i, 1)[0]);
  }
  return result;
};

// Chia % cho khán giả: tổng = 100
// hidden: mảng vị trí đáp án đã bị 50:50 ẩn
export const calcAudience = (answer, hidden) => {
  const result = [0, 0, 0, 0];
  const wrongs = [0, 1, 2, 3].filter((i) => i !== answer && !hidden.includes(i));
  const correctPct = 40 + Math.floor(Math.random() * 31); // 40–70
  result[answer] = correctPct;
  let rest = 100 - correctPct;
  wrongs.forEach((w, idx) => {
    if (idx === wrongs.length - 1) {
      result[w] = rest;
    } else {
      const share = Math.floor(Math.random() * (rest + 1));
      result[w] = share;
      rest -= share;
    }
  });
  return result;
};