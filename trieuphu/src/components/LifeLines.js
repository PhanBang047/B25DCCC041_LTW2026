const Lifelines = ({ used, onUse, onQuit, disabled }) => (
  <div className="lifelines">
    <button disabled={disabled || used.fifty} onClick={() => onUse('fifty')}>
      50:50
    </button>
    <button disabled={disabled || used.audience} onClick={() => onUse('audience')}>
      Hỏi khán giả
    </button>
    <button disabled={disabled} onClick={onQuit}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;