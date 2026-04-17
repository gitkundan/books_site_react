import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const navigate = useNavigate();
  return (
    <div className="col">
      <div
        className="card h-100 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <img src={book.cover} alt={book.title} className="card-img-top" />
        <div className="card-body d-flex flex-column p-2">
          <h6 className="card-title mb-1">{book.title}</h6>
          <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{book.author}</p>
          <div className="mb-1">
            <span className="book-price">£{book.price.toFixed(2)}</span>
          </div>
          <div className="mt-auto">
            {book.inStock
              ? <span className="badge bg-success">In Stock</span>
              : <span className="badge bg-secondary">Out of Stock</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
