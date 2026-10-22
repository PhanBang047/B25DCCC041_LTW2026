import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    {percents.map((p, i) => (
      <div key={i} className="audience-row">
        <div className="audience-bar" style={{ width: `${p}%` }}>
          {`${LETTERS[i]}: ${p}%`}
        </div>
      </div>
    ))}
  </div>
);

export default AudienceChart;