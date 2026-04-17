import BookCard from './BookCard';

export default function BookGrid({ books }) {
  if (books.length === 0) {
    return <p className="text-muted p-3">No books match your filters.</p>;
  }
  return (
    <div className="row row-cols-2 row-cols-md-4 g-3">
      {books.map(b => <BookCard key={b.id} book={b} />)}
    </div>
  );
}
