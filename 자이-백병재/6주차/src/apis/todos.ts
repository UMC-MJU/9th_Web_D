// todos 네트워크 요청 응답에 대한 인터페이스
interface TodoResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<TodoResponse[]> => {
  // 네트워크 요청을 통해 todos 데이터를 가져옵니다.
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');

  // 응답이 성공하지 않으면 에러를 던집니다.
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  // 응답을 파싱합니다.
  const todos = await response.json();

  // 파싱된 데이터를 반환합니다.
  return todos;
};