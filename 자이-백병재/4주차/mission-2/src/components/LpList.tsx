import useGetLp from "../hooks/queries/useGetLp";
import LpCard from "./LpCard";

export function LpList() {
    const { data } = useGetLp({});

    return <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-5">
    {data?.data?.data.map((lp)=><LpCard lp={lp} />)}</div>

}

export default LpList;