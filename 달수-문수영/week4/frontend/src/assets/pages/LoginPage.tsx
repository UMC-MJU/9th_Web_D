const LoginPage = () => {
    const handleSubmit = () => {
        // TODO: implement submit logic
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    className={'border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm'}
                    type={"email"}
                    placeholder={"이메일"}
                />
                <div className="text-red-500 text-sm">이메일 에러</div>
                <input
                    className={'border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm'}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={false}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300">
                        로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;