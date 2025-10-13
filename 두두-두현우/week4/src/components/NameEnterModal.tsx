import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface NameEnterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameSubmit: (name: string) => void;
}

type NameFormValues = {
  name: string;
};

export default function NameEnterModal({
  isOpen,
  onClose,
  onNameSubmit,
}: NameEnterModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NameFormValues>();
  const navigate = useNavigate();

  const onSubmit = (data: NameFormValues) => {
    onNameSubmit(data.name);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            이름을 입력해주세요
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              {...register("name", {
                required: "이름을 입력해주세요.",
              })}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.name
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="이름"
            />
            {errors.name && (
              <div className="mt-2 text-red-300 text-sm flex items-center space-x-1">
                <i className="ri-error-warning-line text-xs"></i>
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-2xl whitespace-nowrap hover:bg-white/90 transition-all duration-300 cursor-pointer"
          >
            환영합니다!
          </button>
        </form>
      </div>
    </div>
  );
}
