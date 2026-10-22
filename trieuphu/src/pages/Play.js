import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize, calcAudience } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const PlayGame = ({ questions, playerName, addHistory }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [used, setUsed] = useState({ fifty: false, audience: false });
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);

  const question = questions[index];

  const finish = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    addHistory({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  const handleUse = (type) => {
    if (status !== 'answering') return;
    if (type === 'fifty' && !used.fifty) {
      const wrongs = [0, 1, 2, 3].filter((i) => i !== question.answer);
      const toHide = [...wrongs].sort(() => Math.random() - 0.5).slice(0, 2);
      setHidden(toHide);
      setUsed((u) => ({ ...u, fifty: true }));
    }
    if (type === 'audience' && !used.audience) {
      setAudience(calcAudience(question.answer, hidden));
      setUsed((u) => ({ ...u, audience: true }));
    }
  };

  const handleQuit = () => {
    if (status !== 'answering') return;
    finish(index, 'quit');
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
            setHidden([]);
            setAudience(null);
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

  // Phím tắt A-D
  useEffect(() => {
    const handleKey = (e) => {
      const i = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
      if (i === -1) return;
      handleSelect(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden, index]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, questions.length, playerName]);

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <Lifelines
          used={used}
          onUse={handleUse}
          onQuit={handleQuit}
          disabled={status !== 'answering'}
        />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={question}
          status={status}
          selected={selected}
          hidden={hidden}
          onSelect={handleSelect}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

// Chưa có tên thì đá về trang chủ
const Play = ({ questions, playerName, addHistory }) =>
  playerName.trim() === '' ? (
    <Navigate to="/" replace />
  ) : (
    <PlayGame questions={questions} playerName={playerName} addHistory={addHistory} />
  );

export default Play;