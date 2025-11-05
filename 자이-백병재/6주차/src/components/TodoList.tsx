import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from '../apis/todos';

export const TodoList = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>
        {data?.map((t) => (
          <li key={t.id}>
            <label>
              <input type='checkbox' checked={t.completed} readOnly /> {t.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};