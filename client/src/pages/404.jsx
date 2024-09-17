// src/components/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-black/80">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl mt-4 text-slate-50">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-blue-600 underline hover:text-blue-800">
        Go back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
