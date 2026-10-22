import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

const PlayGame = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];

  const finish = (correctCount, reason) => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        prize: calcPrize(correctCount, reason),
        correctCount,
        reason,
      },
    });
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // Hết giờ = trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      finish(index, 'timeout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Các bước chờ: locked -> (1s) -> revealed -> (2s) -> câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const id = setTimeout(() => {
        if (selected === question.answer) {
          if (index === questions.length - 1) {
            finish(index + 1, 'win');
          } else {
            setIndex(index + 1);
            setSelected(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          }
        } else {
          finish(index, 'wrong');
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={question}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

// Chưa có tên thì đá về trang chủ
const Play = ({ questions, playerName }) =>
  playerName.trim() === '' ? (
    <Navigate to="/" replace />
  ) : (
    <PlayGame questions={questions} playerName={playerName} />
  );

export default Play;