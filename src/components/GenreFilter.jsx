export default function GenreFilter({ genres, activeGenre, onSelect }) {
  return (
    <aside className="filter-aside">
      <div className="card shadow-sm">
        <div className="card-body p-2">
          <h6 className="fw-bold mb-2 px-2">Genre</h6>
          <ul className="list-unstyled mb-0" id="genre-list">
            {genres.map(g => (
              <li key={g}>
                <a
                  href="#"
                  className={`genre-link ${g === activeGenre ? 'active' : ''}`}
                  onClick={e => { e.preventDefault(); onSelect(g); }}
                >
                  {g}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
