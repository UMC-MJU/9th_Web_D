import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import LpList from "../components/LpList";
import { CreateLpButton } from "../components/CreateLpButton";

const MainPage = () => {
    const { getItem, removeItem } = useLocalStorage('signupSuccess');

    useEffect(() => {
        const signupSuccess = getItem();

        if (signupSuccess) {
            alert('회원가입이 완료되었습니다. 로그인 해 주세요.');
            removeItem();
        }
    }, []);

    return (
        <>
        <LpList />
        <CreateLpButton />
        </>
    );
};

export default MainPage;