export default function BookDetail({ book }) {
  return (
    <div className="detail-layout" id="detail">
      <img src={book.cover} alt={book.title} className="detail-cover" />
      <div className="flex-grow-1">
        <h2 className="fw-bold mb-1">{book.title}</h2>
        <p className="text-muted mb-3">by {book.author}</p>
        <div className="mb-3">
          <span className="book-price fs-5">£{book.price.toFixed(2)}</span>
        </div>
        <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
          <span className="badge bg-primary">{book.genre}</span>
          {book.inStock
            ? <span className="badge bg-success">In Stock</span>
            : <span className="badge bg-secondary">Out of Stock</span>}
        </div>
        <p className="text-secondary">{book.description}</p>
      </div>
    </div>
  );
}
