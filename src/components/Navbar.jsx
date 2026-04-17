import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold fs-5 text-white text-decoration-none" to="/">
        Books to Read
      </Link>
    </nav>
  );
}
