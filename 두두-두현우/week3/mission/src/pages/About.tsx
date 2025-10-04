const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 p-5">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-8">About This App</h1>
        <div className="bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Movie Database App</h2>
          <p className="text-lg mb-4 opacity-90">
            This application allows you to browse and discover popular movies
            using The Movie Database (TMDB) API.
          </p>
          <h3 className="text-xl font-semibold mb-3">Features:</h3>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Browse popular movies</li>
            <li>View movie details including ratings and release dates</li>
            <li>Responsive design for all devices</li>
            <li>Modern UI with dark theme</li>
          </ul>
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm opacity-75">
              Built with React, TypeScript, Tailwind CSS, and powered by TMDB
              API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
