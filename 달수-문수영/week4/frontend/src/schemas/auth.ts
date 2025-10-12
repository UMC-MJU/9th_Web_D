import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요!')
    .regex(
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      '올바른 이메일 형식이 아닙니다!'
    ),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다!')
    .max(20, '비밀번호는 20자 이하여야 합니다!'),
});

// 회원가입 스키마
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요!')
    .regex(
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      '올바른 이메일 형식이 아닙니다!'
    ),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다!')
    .max(20, '비밀번호는 20자 이하여야 합니다!'),
  confirmPassword: z.string(),
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요!')
    .min(2, '닉네임은 2자 이상이어야 합니다!')
    .max(10, '닉네임은 10자 이하여야 합니다!'),
}).refine((data) => {
  if (!data.confirmPassword) {
    return false;
  }
  return data.password === data.confirmPassword;
}, {
  message: '비밀번호 확인을 입력해주세요!',
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: '비밀번호가 일치하지 않습니다!',
  path: ['confirmPassword'],
});

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
