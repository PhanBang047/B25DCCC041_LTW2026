import { PRIZES, MILESTONES, formatMoney } from '../data';

// current: vị trí câu đang chơi (bắt đầu từ 0)
const MoneyLadder = ({ current }) => {
  const steps = PRIZES.map((prize, i) => ({ prize, number: i + 1 })).reverse();

  return (
    <ul className="ladder">
      {steps.map(({ prize, number }) => {
        const classes = [
          'ladder-item',
          MILESTONES.includes(number) ? 'milestone' : '',
          number === current + 1 ? 'current' : '',
        ].join(' ');
        return (
          <li key={number} className={classes}>
            {`${number}. ${formatMoney(prize)}`}
          </li>
        );
      })}
    </ul>
  );
};

export default MoneyLadder;