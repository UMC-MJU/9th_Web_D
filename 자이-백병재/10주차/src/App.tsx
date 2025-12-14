import { useGetMovie } from "./hooks/useMovie";

function App() {

  const { data } = useGetMovie();
console.log(data?.results);

  return (
    <>
    {data?.results.map((movie) => (
      <div key={movie.title}>
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
      </div>
    ))}
    </>
  )
}

export default App