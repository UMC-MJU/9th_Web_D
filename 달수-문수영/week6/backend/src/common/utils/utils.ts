export function excludeFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  if (!obj || typeof obj !== 'object') {
    throw new Error('excludeFields 함수의 첫 번째 인자는 객체여야 합니다.');
  }

  if (!Array.isArray(keys)) {
    throw new Error('excludeFields 함수의 두 번째 인자는 배열이어야 합니다.');
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}
