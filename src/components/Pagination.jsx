export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" href="#" onClick={e => { e.preventDefault(); onPageChange(currentPage - 1); }}>
            &laquo; Prev
          </a>
        </li>
        {pages.map(p => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <a className="page-link" href="#" onClick={e => { e.preventDefault(); onPageChange(p); }}>
              {p}
            </a>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a className="page-link" href="#" onClick={e => { e.preventDefault(); onPageChange(currentPage + 1); }}>
            Next &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
}
