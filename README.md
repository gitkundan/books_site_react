# Books Site — React

A client-side book catalogue built with React 19, Vite 8, React Router v7, and Bootstrap 5. It is a faithful React reimplementation of the plain-HTML version at [gitkundan/books_site](https://github.com/gitkundan/books_site).

---

## Stack

| Tool | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| React Router DOM | 7 |
| Bootstrap | 5 |

---

## Project structure

```
src/
  main.jsx            # Entry point — mounts app, imports Bootstrap + CSS
  App.jsx             # Router + DEBUG mode logic
  style.css           # All custom styles including debug overlay
  data/
    books.js          # BOOKS array (50 books: 25 Mystery, 25 Humour)
  pages/
    CataloguePage.jsx # Route "/" — genre filter, grid, pagination
    DetailPage.jsx    # Route "/book/:id" — single book detail view
  components/
    Navbar.jsx        # Top navigation bar with site title link
    Footer.jsx        # Bottom copyright footer
    GenreFilter.jsx   # Sidebar genre filter list
    BookGrid.jsx      # Responsive card grid, delegates to BookCard
    BookCard.jsx      # Individual book card, navigates on click
    BookDetail.jsx    # Full book detail layout (cover, info, badges)
    Pagination.jsx    # Prev / numbered pages / Next controls
public/
  cover.jpg           # Placeholder cover image served at /cover.jpg
```

---

## Routing

Defined in `App.jsx` using React Router v7 declarative `<Routes>`:

| Path | Page | Description |
|---|---|---|
| `/` | `CataloguePage` | Genre filter + paginated book grid |
| `/book/:id` | `DetailPage` | Detail view for a single book by numeric ID |

`main.jsx` wraps the whole app in `<BrowserRouter>` so all child components can use Router hooks.

---

## Component responsibilities

### `CataloguePage`
Owns the two pieces of UI state:
- `activeGenre` — which genre tab is selected (default `'All'`)
- `currentPage` — current pagination page (default `1`)

Derives filtered and paginated slices of `BOOKS` from those two values. Passes callbacks down:
- `onSelect` to `GenreFilter` — sets genre and resets page to 1
- `onPageChange` to `Pagination` — validates bounds, scrolls to top

Renders: `Navbar` → `GenreFilter` (sidebar) + `BookGrid` + `Pagination` → `Footer`

### `DetailPage`
Reads `:id` from the URL via `useParams`, looks it up in `BOOKS`, and sets `document.title` via `useEffect`. Shows a warning alert if no match is found.

### `GenreFilter`
Receives the full list of genres, the active genre, and a selection callback as props. Renders a `<ul id="genre-list">` of anchor links — clicking one calls `onSelect` via `e.preventDefault()` to avoid page reload.

### `BookGrid`
Renders a Bootstrap responsive grid (`row-cols-2 row-cols-md-4`). Delegates each item to `BookCard`. Shows a fallback message when the filtered list is empty.

### `BookCard`
Uses `useNavigate` to push `/book/${book.id}` on card click. Displays cover image, title, author, price, and an in-stock badge.

### `BookDetail`
Purely presentational. Receives the full book object and renders a two-column layout (cover image + info panel with price, genre badge, stock badge, and description).

### `Pagination`
Hides itself when `totalPages <= 1`. Renders Prev / numbered pages / Next, marking the active page and disabling out-of-bounds buttons.

### `Navbar`
Dark Bootstrap navbar. The brand title is a `<Link to="/">` so clicking it always returns to the catalogue.

### `Footer`
Static copyright footer.

---

## Data

`src/data/books.js` exports a `BOOKS` array of 50 objects. Each book has:

```js
{
  id: Number,
  title: String,
  author: String,
  price: Number,
  genre: 'Mystery' | 'Humour',
  inStock: Boolean,
  description: String,
  cover: '/cover.jpg',   // all point to the single placeholder image
}
```

---

## DEBUG mode

`App.jsx` exports a top-of-file constant:

```js
const DEBUG = true;   // set false to disable
```

When `true`, after every route change `useEffect` (keyed on `location` from `useLocation`):
1. Adds the `debug` class to `<body>`, which activates gold `2px solid gold` borders on all major layout blocks via CSS.
2. Runs `applyDebugLabels()`, which sets a `data-debug-label` attribute on every matched element. CSS then renders these as purple monospace `::before` pseudo-elements showing the element's tag + class selector string.

To disable debug mode, set `const DEBUG = false` in [src/App.jsx](src/App.jsx).

---

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```
