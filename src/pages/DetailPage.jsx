import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { BOOKS } from '../data/books';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookDetail from '../components/BookDetail';

export default function DetailPage() {
  const { id } = useParams();
  const book = BOOKS.find(b => b.id === Number(id));

  useEffect(() => {
    document.title = book ? book.title : 'Book not found';
  }, [book]);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-4">
        <Link to="/" className="text-muted text-decoration-none mb-4 d-inline-block">
          &larr; Back to catalogue
        </Link>
        {book
          ? <BookDetail book={book} />
          : (
            <div className="alert alert-warning">
              Book not found. <Link to="/">Return to catalogue</Link>.
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
}
