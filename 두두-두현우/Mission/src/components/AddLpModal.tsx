import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLp } from "../apis/lp";
import type { Lp } from "../types/lp";

interface AddLpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (lp: Lp) => void;
}

const lpSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  content: z.string().min(1, { message: "내용을 입력해주세요." }),
  thumbnail: z.string().min(1, { message: "썸네일 이미지를 추가해주세요." }),
  tagsText: z.string(),
});

type LpFormValues = z.infer<typeof lpSchema>;

export default function AddLpModal({
  isOpen,
  onClose,
  onCreated,
}: AddLpModalProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [thumbPreview, setThumbPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<LpFormValues>({
    resolver: zodResolver(lpSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      tagsText: "",
    },
  });
  const thumbnailValue = watch("thumbnail");
  const tagsTextValue = watch("tagsText");

  const handleClose = () => {
    reset();
    setErrorMsg("");
    setState("idle");
    setThumbPreview("");
    setTags([]);
    onClose();
  };

  const onSubmit = async (values: LpFormValues) => {
    setErrorMsg("");
    setState("loading");
    try {
      const lp = await createLp({
        title: values.title,
        content: values.content,
        thumbnail: values.thumbnail || "",
        tags,
        published: true,
      });
      setState("success");
      onCreated?.(lp);
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch {
      setState("error");
      setErrorMsg("LP 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setTimeout(() => {
        setState("idle");
      }, 1500);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const isAccepted = file.type === "image/png" || file.type === "image/jpeg";
    if (!isAccepted) {
      setErrorMsg("PNG 또는 JPG 이미지만 업로드할 수 있습니다.");
      return;
    }
    const url = URL.createObjectURL(file);
    setThumbPreview(url);
    setValue("thumbnail", url, { shouldValidate: true, shouldDirty: true });
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (state === "loading") return;
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0] ?? null;
    handleFile(file);
    event.currentTarget.value = "";
  };

  const addTag = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    if (tags.includes(name)) return;
    setTags((prev) => [...prev, name]);
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  const onTagKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(tagsTextValue || "");
      setValue("tagsText", "");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative max-w-xl w-full mx-4 p-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">LP 추가</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-white/80">제목</label>
            <input
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.title
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="제목을 입력하세요"
              disabled={state === "loading"}
            />
            {errors.title && (
              <p className="mt-2 text-red-300 text-sm">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">내용</label>
            <textarea
              rows={5}
              {...register("content")}
              className={`w-full px-4 py-3 backdrop-blur-md bg-black/20 border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 ${
                errors.content
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-white/20 focus:ring-white/30"
              }`}
              placeholder="본문을 입력하세요"
              disabled={state === "loading"}
            />
            {errors.content && (
              <p className="mt-2 text-red-300 text-sm">
                {errors.content.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">썸네일</label>
            {thumbPreview || thumbnailValue ? (
              <div className="mb-3 overflow-hidden rounded-2xl border border-white/20 bg-black/30">
                <img
                  src={thumbPreview || thumbnailValue}
                  alt="thumbnail preview"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: 240 }}
                />
              </div>
            ) : (
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="mb-3 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-white/25 bg-black/20 p-4 text-white/70"
              >
                <div className="flex flex-col items-center text-center text-xs">
                  <span className="mb-2">PNG, JPG 이미지</span>
                  <span className="text-white/50">또는</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 rounded-full bg-white/90 px-3 py-1 text-black cursor-pointer hover:bg-white"
                    disabled={state === "loading"}
                  >
                    파일 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={onFileChange}
                    disabled={state === "loading"}
                  />
                </div>
              </div>
            )}
            <input type="hidden" {...register("thumbnail")} />
            {errors.thumbnail && (
              <p className="mt-2 text-red-300 text-sm">
                {errors.thumbnail.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">태그</label>
            <input
              type="text"
              {...register("tagsText")}
              onKeyDown={onTagKeyDown}
              className="w-full px-4 py-3 backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all duration-300"
              placeholder="입력 후 Enter로 태그 추가"
              disabled={state === "loading"}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="group relative inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 rounded-full bg-white/80 px-1 text-black opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && <div className="text-red-300 text-sm">{errorMsg}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-2xl border border-white/20 text-white/90 backdrop-blur cursor-pointer hover:bg-white/10 transition"
              disabled={state === "loading"}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid || state === "loading" || state === "success"}
              className={`px-4 py-2 rounded-2xl font-semibold transition cursor-pointer ${
                !isValid
                  ? "bg-white/30 text-white/50 cursor-not-allowed"
                  : state === "loading"
                  ? "bg-white text-black opacity-80 cursor-not-allowed"
                  : state === "success"
                  ? "bg-green-400 text-white"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {state === "loading"
                ? "등록 중..."
                : state === "success"
                ? "완료!"
                : "확인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
