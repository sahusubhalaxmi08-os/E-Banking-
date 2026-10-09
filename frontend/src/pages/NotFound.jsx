import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}