import LpCardSkeleton from "./LpCardSkeleton";

interface LpListSkeletonProps {
  count: number;
}

const LpListSkeleton = ({ count }: LpListSkeletonProps) => {
    return(
    <>
      {new Array(count).fill(0).map((value, index) => (
        <LpCardSkeleton key={index} />
      ))}
    </>);
}

export default LpListSkeleton;