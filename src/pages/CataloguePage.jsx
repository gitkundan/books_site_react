import { useState } from 'react';
import { BOOKS } from '../data/books';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GenreFilter from '../components/GenreFilter';
import BookGrid from '../components/BookGrid';
import Pagination from '../components/Pagination';

const BOOKS_PER_PAGE = 5;

export default function CataloguePage() {
  const [activeGenre, setActiveGenre] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const genres = ['All', ...new Set(BOOKS.map(b => b.genre))];
  const filtered = BOOKS.filter(b => activeGenre === 'All' || b.genre === activeGenre);
  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  function handleGenreSelect(genre) {
    setActiveGenre(genre);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container-fluid py-4">
        <div className="d-flex gap-4 align-items-start">
          <GenreFilter genres={genres} activeGenre={activeGenre} onSelect={handleGenreSelect} />
          <section className="flex-grow-1">
            <BookGrid books={paginated} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
