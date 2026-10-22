import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ number, total, question, status, selected, onSelect }) => {
  const getState = (i) => {
    if (status === 'locked') return i === selected ? 'selected' : '';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div className="question-card">
      <h3>{`Câu ${number}/${total}`}</h3>
      <p className="question-text">{question.question}</p>
      <div className="answer-grid">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;