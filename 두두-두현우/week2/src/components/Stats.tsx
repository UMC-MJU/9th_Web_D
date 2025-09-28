interface StatsProps {
  totalCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

const Stats = ({
  totalCount,
  todoCount,
  inProgressCount,
  doneCount,
}: StatsProps) => {
  return (
    <div className="stats">
      <div className="stats_section">
        <div className="stats_count">{totalCount}</div>
        <div className="stats_title">전체 할 일</div>
      </div>
      <div className="stats_section">
        <div className="stats_count">{todoCount}</div>
        <div className="stats_title">시작 전</div>
      </div>
      <div className="stats_section">
        <div className="stats_count">{inProgressCount}</div>
        <div className="stats_title">진행 중</div>
      </div>
      <div className="stats_section">
        <div className="stats_count">{doneCount}</div>
        <div className="stats_title">완료됨</div>
      </div>
    </div>
  );
};

export default Stats;
