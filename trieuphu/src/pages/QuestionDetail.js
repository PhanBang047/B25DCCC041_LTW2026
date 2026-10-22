import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{`Câu hỏi số ${question.id} (${LEVELS[question.level]})`}</h2>
      <p>{question.question}</p>
      <ul className="options">
        {question.options.map((option, index) => (
          <li key={index} className={index === question.answer ? 'correct' : ''}>
            {`${LETTERS[index]}. `}{option}
            {index === question.answer && ' (Đáp án đúng)'}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;