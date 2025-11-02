interface HomePageProps {
  username: string;
}

export default function HomePage({ username }: HomePageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-white">
        {username ? `Welcome, ${username}!` : "Welcome"}
      </h1>
    </div>
  );
}
