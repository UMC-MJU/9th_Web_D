import { useParams } from "react-router-dom";

const DetailPage = () => {
    const { id } = useParams();
    return (<h1>{id}</h1>) ;
}

export default DetailPage;