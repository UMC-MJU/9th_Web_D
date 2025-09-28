import { useTheme } from "../hooks/useTheme";

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
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <div className="bg-blue-500 text-white rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
        <div className="text-3xl font-bold mb-2">{totalCount}</div>
        <div className="text-sm font-semibold opacity-90">전체 할 일</div>
      </div>
      <div
        className={`rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1 ${
          isDark ? "bg-gray-600" : "bg-white"
        }`}
      >
        <div
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {todoCount}
        </div>
        <div
          className={`text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          시작 전
        </div>
      </div>
      <div
        className={`rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1 ${
          isDark ? "bg-orange-900" : "bg-orange-100"
        }`}
      >
        <div
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-orange-300" : "text-orange-700"
          }`}
        >
          {inProgressCount}
        </div>
        <div
          className={`text-sm font-semibold ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`}
        >
          진행 중
        </div>
      </div>
      <div
        className={`rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1 ${
          isDark ? "bg-green-900" : "bg-green-100"
        }`}
      >
        <div
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-green-300" : "text-green-700"
          }`}
        >
          {doneCount}
        </div>
        <div
          className={`text-sm font-semibold ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          완료됨
        </div>
      </div>
    </div>
  );
};

export default Stats;
