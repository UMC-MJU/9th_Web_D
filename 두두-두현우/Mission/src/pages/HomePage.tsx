interface HomePageProps {
  username: string;
}

export default function HomePage({ username }: HomePageProps) {
  return (
    <div className="flex min-h-screen items-start justify-start p-8">
      <h1 className="text-2xl font-semibold text-white">
        {username ? `Welcome, ${username}!` : "Welcome"}
      </h1>
    </div>
  );
}
