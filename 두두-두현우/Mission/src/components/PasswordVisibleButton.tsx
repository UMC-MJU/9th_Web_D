interface PasswordVisibleButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function PasswordVisibleButton({
  isVisible,
  onClick,
}: PasswordVisibleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer focus:outline-none"
    >
      <i
        className={`${isVisible ? "ri-eye-off-line" : "ri-eye-line"} text-lg`}
      ></i>
    </button>
  );
}
