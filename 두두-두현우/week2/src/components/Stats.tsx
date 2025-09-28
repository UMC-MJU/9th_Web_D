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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <div className="bg-blue-500 text-white rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2">{totalCount}</div>
        <div className="text-sm font-semibold opacity-90">전체 할 일</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-gray-800">{todoCount}</div>
        <div className="text-sm font-semibold text-gray-600">시작 전</div>
      </div>
      <div className="bg-orange-100 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-orange-700">
          {inProgressCount}
        </div>
        <div className="text-sm font-semibold text-orange-600">진행 중</div>
      </div>
      <div className="bg-green-100 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-green-700">
          {doneCount}
        </div>
        <div className="text-sm font-semibold text-green-600">완료됨</div>
      </div>
    </div>
  );
};

export default Stats;
