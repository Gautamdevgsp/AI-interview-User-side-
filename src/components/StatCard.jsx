const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <div className="stat-value">{value}%</div>
      <div className="progress-wrapper">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default StatCard;