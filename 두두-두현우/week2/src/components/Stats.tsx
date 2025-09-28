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
      <div className="bg-white dark:bg-gray-600 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
          {todoCount}
        </div>
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          시작 전
        </div>
      </div>
      <div className="bg-orange-100 dark:bg-orange-900 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-orange-700 dark:text-orange-300">
          {inProgressCount}
        </div>
        <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
          진행 중
        </div>
      </div>
      <div className="bg-green-100 dark:bg-green-900 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2 text-green-700 dark:text-green-300">
          {doneCount}
        </div>
        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
          완료됨
        </div>
      </div>
    </div>
  );
};

export default Stats;
