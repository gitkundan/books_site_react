# Book Catalogue Site — React + Vite Single-Shot Build Guide

A book catalogue site using React, JSX, and Vite. Visually identical to the plain-HTML version at https://github.com/gitkundan/books_site. The only difference is the implementation stack.

---

## Stack

- **Vite** for dev server and build
- **React 19** with **JSX** (`.jsx` files)
- **React Router v7** (`react-router-dom`) for client-side routing
- **Bootstrap 5** installed via npm — import CSS in `main.jsx`
- **No other UI libraries** — no Tailwind, no MUI, no styled-components
- `cover.jpg` is the single image used for all books — place it in `public/cover.jpg`

---

## Project Setup

Scaffold into a temp directory then move files up so the project lives directly in your target folder:

```bash
# Inside your target directory
npm create vite@latest .tmp-scaffold -- --template react
cp -r .tmp-scaffold/public .tmp-scaffold/src .tmp-scaffold/index.html \
      .tmp-scaffold/package.json .tmp-scaffold/vite.config.js \
      .tmp-scaffold/eslint.config.js .
rm -rf .tmp-scaffold

# Fix package name in package.json: change "tmp-scaffold" → "books-site"

npm install
npm install react-router-dom bootstrap

# Copy cover image
cp /path/to/cover.jpg public/cover.jpg
```

---

## Final File Structure

```
books-site/
├── public/
│   └── cover.jpg
├── src/
│   ├── data/
│   │   └── books.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── GenreFilter.jsx
│   │   ├── BookCard.jsx
│   │   ├── BookGrid.jsx
│   │   ├── Pagination.jsx
│   │   └── BookDetail.jsx
│   ├── pages/
│   │   ├── CataloguePage.jsx
│   │   └── DetailPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── index.html
├── package.json
└── vite.config.js
```

Delete the scaffolded boilerplate files (`src/App.css`, `src/index.css`, `src/assets/`) — they are not used.

---

## `src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## `src/App.jsx`

Contains the router and the DEBUG mode logic. Set `DEBUG = true` to show gold borders and purple selector labels on all structural elements (matches the HTML version's debug mode exactly). Re-applies labels after every route change.

```jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CataloguePage from './pages/CataloguePage';
import DetailPage from './pages/DetailPage';

// Set to true to show gold debug borders on all blocks
const DEBUG = true;

const DEBUG_SELECTORS = [
  'nav', 'footer', 'aside', 'section',
  '.card', '.card-body',
  '.pagination', '#genre-list',
  '.container', '.container-fluid',
];

function applyDebugLabels() {
  DEBUG_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const tag = el.tagName.toLowerCase();
      const classes = el.className
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : '';
      el.setAttribute('data-debug-label', tag + classes);
    });
  });
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (DEBUG) {
      document.body.classList.add('debug');
      applyDebugLabels();
    } else {
      document.body.classList.remove('debug');
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/book/:id" element={<DetailPage />} />
    </Routes>
  );
}
```

---

## `src/components/Navbar.jsx`

Dark navbar, site name on the left linking to `/`.

```jsx
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
```

---

## `src/components/Footer.jsx`

```jsx
export default function Footer() {
  return (
    <footer className="text-center text-muted py-3 border-top mt-4">
      <small>&copy; 2026 Books to Read. All rights reserved.</small>
    </footer>
  );
}
```

---

## `src/components/GenreFilter.jsx`

Props: `genres` (string[]), `activeGenre` (string), `onSelect` (fn).

```jsx
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
```

---

## `src/components/BookCard.jsx`

Props: `book` object. Clicking the card navigates to `/book/{id}`.

```jsx
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
```

---

## `src/components/BookGrid.jsx`

```jsx
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
```

---

## `src/components/Pagination.jsx`

Props: `currentPage` (number), `totalPages` (number), `onPageChange` (fn). Prev disabled on page 1, Next disabled on last page.

```jsx
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
```

---

## `src/components/BookDetail.jsx`

Props: `book` object.

```jsx
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
```

---

## `src/pages/CataloguePage.jsx`

State: `currentPage` (starts at 1), `activeGenre` (starts at `'All'`). 5 books per page.

```jsx
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
```

---

## `src/pages/DetailPage.jsx`

Reads `id` from URL params. Sets document title via `useEffect`. Shows warning alert if book not found.

```jsx
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
```

---

## `src/data/books.js`

```js
export const BOOKS = [
  {
    id: 1, title: "The Silent Patient", author: "Alex Michaelides",
    price: 8.99, genre: "Mystery", inStock: true,
    description: "Alicia Berenson's life is seemingly perfect — until she shoots her husband five times and never speaks another word. Her refusal to talk makes the case all the more mysterious, and detective Theo Faber becomes obsessed with uncovering the truth. A gripping psychological thriller that will leave you breathless.",
    cover: "/cover.jpg"
  },
  {
    id: 2, title: "The Thursday Murder Club", author: "Richard Osman",
    price: 7.49, genre: "Mystery", inStock: true,
    description: "In a peaceful retirement village, four unlikely friends meet weekly to investigate unsolved crimes. When a real murder lands on their doorstep, they find themselves in the middle of their first live case. Sharp, funny, and utterly compelling.",
    cover: "/cover.jpg"
  },
  {
    id: 3, title: "Magpie Murders", author: "Anthony Horowitz",
    price: 9.99, genre: "Mystery", inStock: true,
    description: "Editor Susan Ryeland is given a manuscript for the latest Atticus Pünd mystery — but the last chapter is missing, and the author is found dead. A brilliant novel-within-a-novel that celebrates and subverts the golden age of detective fiction.",
    cover: "/cover.jpg"
  },
  {
    id: 4, title: "The No. 1 Ladies' Detective Agency", author: "Alexander McCall Smith",
    price: 6.99, genre: "Mystery", inStock: true,
    description: "Precious Ramotswe sets up Botswana's only female-run detective agency armed with little more than a kettle and her sharp intuition. Her cases range from the petty to the profound, all told with warmth and wisdom. A gentle, deeply human mystery series.",
    cover: "/cover.jpg"
  },
  {
    id: 5, title: "In the Woods", author: "Tana French",
    price: 8.49, genre: "Mystery", inStock: false,
    description: "Detective Rob Ryan returns to the Dublin suburb where, as a child, two of his friends vanished without a trace. When a girl is murdered in the same woods, Ryan finds his past and present colliding in dangerous ways. Dark, atmospheric, and utterly absorbing.",
    cover: "/cover.jpg"
  },
  {
    id: 6, title: "Gone Girl", author: "Gillian Flynn",
    price: 7.99, genre: "Mystery", inStock: true,
    description: "On their fifth wedding anniversary, Nick Dunne's wife Amy disappears. As the police investigation unfolds, the media descends and secrets emerge on both sides of the marriage. A razor-sharp dissection of modern relationships and the stories we tell ourselves.",
    cover: "/cover.jpg"
  },
  {
    id: 7, title: "Big Little Lies", author: "Liane Moriarty",
    price: 8.49, genre: "Mystery", inStock: true,
    description: "Three women, three marriages, and one fatal night at a school trivia night. Moriarty weaves together dark secrets and sharp comedy to expose the hidden lives of suburban mothers. Impossible to put down.",
    cover: "/cover.jpg"
  },
  {
    id: 8, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson",
    price: 9.49, genre: "Mystery", inStock: true,
    description: "Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate a forty-year-old disappearance within a powerful Swedish family. A labyrinthine thriller packed with corporate corruption and deeply compelling characters. The trilogy that changed crime fiction forever.",
    cover: "/cover.jpg"
  },
  {
    id: 9, title: "And Then There Were None", author: "Agatha Christie",
    price: 6.49, genre: "Mystery", inStock: true,
    description: "Ten strangers are lured to a remote island and begin to die one by one in accordance with a nursery rhyme. Christie's most famous standalone novel remains the best-selling mystery of all time. A masterpiece of misdirection.",
    cover: "/cover.jpg"
  },
  {
    id: 10, title: "The Name of the Rose", author: "Umberto Eco",
    price: 10.99, genre: "Mystery", inStock: false,
    description: "A Franciscan friar and his novice investigate a series of mysterious deaths at a medieval Italian abbey. Eco fuses detective fiction with semiotics, theology, and medieval history to dazzling effect. Dense, brilliant, and completely unlike anything else.",
    cover: "/cover.jpg"
  },
  {
    id: 11, title: "The Devotion of Suspect X", author: "Keigo Higashino",
    price: 8.99, genre: "Mystery", inStock: true,
    description: "A brilliant mathematician helps his neighbour conceal a murder, then watches as a detective closes in. This inverted mystery asks not whodunit but how the detective will unravel an airtight alibi. A masterwork of Japanese crime fiction.",
    cover: "/cover.jpg"
  },
  {
    id: 12, title: "Rebecca", author: "Daphne du Maurier",
    price: 7.99, genre: "Mystery", inStock: true,
    description: "A young woman marries a brooding widower and moves into his imposing Cornish estate, only to be haunted by the memory of his first wife. Du Maurier's gothic classic is as atmospheric and unsettling as ever. Last night I dreamt I went to Manderley again.",
    cover: "/cover.jpg"
  },
  {
    id: 13, title: "The Woman in the Window", author: "A.J. Finn",
    price: 8.49, genre: "Mystery", inStock: true,
    description: "An agoraphobic woman watches her neighbours from her New York brownstone and believes she witnesses a crime. But can she trust what she saw — or herself? A claustrophobic, Hitchcock-inspired thriller.",
    cover: "/cover.jpg"
  },
  {
    id: 14, title: "Crooked House", author: "Agatha Christie",
    price: 6.99, genre: "Mystery", inStock: false,
    description: "When the patriarch of the wealthy Leonides family is poisoned, the entire household becomes suspect. Christie considered this her personal favourite among all her novels. A gleefully dark twist ending that will shock even seasoned mystery readers.",
    cover: "/cover.jpg"
  },
  {
    id: 15, title: "The Maid", author: "Nita Prose",
    price: 7.49, genre: "Mystery", inStock: true,
    description: "Hotel maid Molly Gray discovers a dead body in a suite and becomes the prime suspect. Endearingly literal-minded and socially oblivious, Molly is one of crime fiction's most original heroines. Warm, clever, and surprisingly moving.",
    cover: "/cover.jpg"
  },
  {
    id: 16, title: "The Dry", author: "Jane Harper",
    price: 8.99, genre: "Mystery", inStock: true,
    description: "Federal agent Aaron Falk returns to his drought-stricken hometown for a friend's funeral and gets drawn into an investigation spanning two decades. Harper's debut is atmospheric, tightly plotted, and deeply felt. The Australian outback has never felt so menacing.",
    cover: "/cover.jpg"
  },
  {
    id: 17, title: "The Hunting Party", author: "Lucy Foley",
    price: 7.99, genre: "Mystery", inStock: true,
    description: "A group of Oxford friends reunite at a remote Scottish lodge for New Year and by morning one of them is dead. Foley peels back years of resentment and secrets with surgical precision. A classic closed-circle mystery for the modern era.",
    cover: "/cover.jpg"
  },
  {
    id: 18, title: "Behind Closed Doors", author: "B.A. Paris",
    price: 7.49, genre: "Mystery", inStock: false,
    description: "Jack and Grace Angel appear to have the perfect marriage — but no one is ever allowed inside their house. Told through alternating timelines, this domestic thriller reveals its horrors gradually and relentlessly. You will never look at a perfect couple the same way again.",
    cover: "/cover.jpg"
  },
  {
    id: 19, title: "The Secret History", author: "Donna Tartt",
    price: 9.99, genre: "Mystery", inStock: true,
    description: "A small group of classics students at a Vermont college reconstruct how they came to commit a murder. Tartt's debut is a dark, intoxicating study of beauty, privilege, and moral collapse. A modern classic told in reverse.",
    cover: "/cover.jpg"
  },
  {
    id: 20, title: "One by One", author: "Ruth Ware",
    price: 8.49, genre: "Mystery", inStock: true,
    description: "A tech company retreats to a luxury chalet in the French Alps for a team-building ski trip — then an avalanche cuts them off and people start dying. Ware's icy locked-room mystery is tense, claustrophobic, and impossible to second-guess.",
    cover: "/cover.jpg"
  },
  {
    id: 21, title: "The Paris Apartment", author: "Lucy Foley",
    price: 8.99, genre: "Mystery", inStock: true,
    description: "Jess arrives in Paris to visit her brother Ben, only to find his apartment empty and his neighbours evasive. As she digs deeper into the building's secrets, the danger grows. A gloriously twisty thriller set in a Haussmann apartment block.",
    cover: "/cover.jpg"
  },
  {
    id: 22, title: "Jar of Hearts", author: "Jennifer Hillier",
    price: 8.49, genre: "Mystery", inStock: false,
    description: "When her high-school boyfriend is arrested for a string of murders, Georgina realises she helped him cover up his first killing sixteen years ago. A propulsive, unflinching thriller about guilt, love, and the price of silence.",
    cover: "/cover.jpg"
  },
  {
    id: 23, title: "The Appeal", author: "Janice Hallett",
    price: 9.49, genre: "Mystery", inStock: true,
    description: "Two trainee lawyers must sift through the emails of an amateur dramatics society to find a murderer. Wickedly funny and structurally ingenious, this novel is told entirely through correspondence. A love letter to Christie that becomes something entirely its own.",
    cover: "/cover.jpg"
  },
  {
    id: 24, title: "The Sanatorium", author: "Sarah Pearse",
    price: 8.99, genre: "Mystery", inStock: true,
    description: "Detective Elin Warner joins her brother at a converted sanatorium hotel in the Swiss Alps — and soon guests begin to disappear in a blizzard. Pearse's debut combines stunning alpine setting with tight procedural plotting. Perfect for fans of gothic atmosphere.",
    cover: "/cover.jpg"
  },
  {
    id: 25, title: "Calling Mr King", author: "Ronald De Feo",
    price: 7.99, genre: "Mystery", inStock: false,
    description: "A hitman on an assignment in London becomes obsessed with the city's bookshops and wonders if there might be another life waiting for him. Deadpan, literary, and darkly funny, this slim novel defies easy categorisation. A hidden gem of crime fiction.",
    cover: "/cover.jpg"
  },
  {
    id: 26, title: "Bossypants", author: "Tina Fey",
    price: 7.99, genre: "Humour", inStock: true,
    description: "Tina Fey takes us from her awkward childhood in Pennsylvania to her rise as head writer at Saturday Night Live and creator of 30 Rock. Written with razor-sharp wit and surprising candour, this memoir is as funny as it is inspiring. Required reading for anyone who has ever been called bossy.",
    cover: "/cover.jpg"
  },
  {
    id: 27, title: "Is Everyone Hanging Out Without Me?", author: "Mindy Kaling",
    price: 6.49, genre: "Humour", inStock: true,
    description: "Mindy Kaling chronicles her journey from chubby kid in Cambridge to Hollywood writer and actress. Packed with hilarious observations about friendship, romance, and the entertainment industry. Impossible to read without laughing out loud on public transport.",
    cover: "/cover.jpg"
  },
  {
    id: 28, title: "Let's Pretend This Never Happened", author: "Jenny Lawson",
    price: 8.99, genre: "Humour", inStock: false,
    description: "Jenny Lawson grew up in rural Texas where her father routinely surprised dinner guests with taxidermied squirrels. This wildly funny memoir charts her bizarre upbringing, her anxiety, and her accidental career as a blogger. Proof that dysfunction and laughter make excellent bedfellows.",
    cover: "/cover.jpg"
  },
  {
    id: 29, title: "Yes Please", author: "Amy Poehler",
    price: 7.49, genre: "Humour", inStock: true,
    description: "Amy Poehler reflects on improvisation, ambition, sleep deprivation, and the art of saying yes. Part memoir, part advice column, and entirely delightful. A book that feels like getting life advice from your funniest, wisest friend.",
    cover: "/cover.jpg"
  },
  {
    id: 30, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams",
    price: 9.49, genre: "Humour", inStock: true,
    description: "Seconds before Earth is demolished to make way for a hyperspace bypass, Arthur Dent is whisked into space by his friend Ford Prefect, a researcher for the eponymous guide. What follows is one of the funniest and most imaginative journeys in literary history. The answer is 42.",
    cover: "/cover.jpg"
  },
  {
    id: 31, title: "Good Omens", author: "Terry Pratchett & Neil Gaiman",
    price: 9.99, genre: "Humour", inStock: true,
    description: "An angel and a demon who have grown rather fond of life on Earth team up to prevent the Apocalypse. Pratchett and Gaiman's collaboration is one of the funniest, most warm-hearted comedies ever written. Heaven and Hell have never been more ridiculous.",
    cover: "/cover.jpg"
  },
  {
    id: 32, title: "Three Men in a Boat", author: "Jerome K. Jerome",
    price: 5.99, genre: "Humour", inStock: true,
    description: "Three men and a dog take a leisurely boating holiday along the Thames and encounter nothing but calamity. Jerome's 1889 comic masterpiece invented the holiday disaster genre and has never been out of print since. Still laugh-out-loud funny after more than a century.",
    cover: "/cover.jpg"
  },
  {
    id: 33, title: "Catch-22", author: "Joseph Heller",
    price: 8.99, genre: "Humour", inStock: true,
    description: "Airman Yossarian is convinced that everyone is trying to get him killed, and in the absurd bureaucracy of wartime, he may be right. Heller's satirical masterpiece coined a phrase and redefined the war novel. Infuriating, hilarious, and deeply humane.",
    cover: "/cover.jpg"
  },
  {
    id: 34, title: "A Walk in the Woods", author: "Bill Bryson",
    price: 7.99, genre: "Humour", inStock: true,
    description: "Bryson attempts to hike the Appalachian Trail with his woefully unprepared friend Katz and nearly kills them both several times. A love letter to America's wilderness disguised as a very funny comedy of errors. Essential Bryson.",
    cover: "/cover.jpg"
  },
  {
    id: 35, title: "Notes from a Small Island", author: "Bill Bryson",
    price: 7.49, genre: "Humour", inStock: false,
    description: "Before returning to America after two decades in Britain, Bryson takes a farewell tour of the country he has come to love. His observations about British eccentricity are affectionate, precise, and consistently hilarious. A classic of travel comedy.",
    cover: "/cover.jpg"
  },
  {
    id: 36, title: "The Rosie Project", author: "Graeme Simsion",
    price: 7.99, genre: "Humour", inStock: true,
    description: "Genetics professor Don Tillman designs a questionnaire to find the perfect wife — and immediately meets Rosie, who fails every criterion. A charming and funny novel about love, difference, and the limits of logic. Impossible not to smile.",
    cover: "/cover.jpg"
  },
  {
    id: 37, title: "Confederacy of Dunces", author: "John Kennedy Toole",
    price: 8.49, genre: "Humour", inStock: true,
    description: "The magnificent and maddening Ignatius J. Reilly lumbers around New Orleans raging against the modern world and getting into catastrophic scrapes. Toole's posthumously published Pulitzer winner is one of American literature's great comic creations. Every page is a gift.",
    cover: "/cover.jpg"
  },
  {
    id: 38, title: "My Man Jeeves", author: "P.G. Wodehouse",
    price: 5.49, genre: "Humour", inStock: true,
    description: "The first collection of stories featuring Bertie Wooster and his supernaturally competent valet Jeeves. Wodehouse's comic timing is without equal and his prose sparkles on every page. The gold standard of English comic writing.",
    cover: "/cover.jpg"
  },
  {
    id: 39, title: "Bridget Jones's Diary", author: "Helen Fielding",
    price: 7.49, genre: "Humour", inStock: true,
    description: "Thirty-something singleton Bridget Jones navigates London singledom, her weight, her cigarette consumption, and the eternal question of Mr Right vs Mr Wrong. Wickedly funny and surprisingly poignant. The diary format is used to devastating comic effect.",
    cover: "/cover.jpg"
  },
  {
    id: 40, title: "I'm a Joke and So Are You", author: "Robin Ince",
    price: 9.49, genre: "Humour", inStock: false,
    description: "Comedian Robin Ince investigates the science of what makes us human — and funny — by interviewing scientists, comedians, and philosophers. Part memoir, part pop science, and entirely entertaining. A surprisingly moving meditation on the human condition.",
    cover: "/cover.jpg"
  },
  {
    id: 41, title: "The 100-Year-Old Man Who Climbed Out the Window and Disappeared", author: "Jonas Jonasson",
    price: 8.99, genre: "Humour", inStock: true,
    description: "On his hundredth birthday, Allan Karlsson climbs out of his nursing-home window rather than attend his own birthday party — accidentally triggering a crime caper that spans seven decades of improbable history. Deadpan and delightful.",
    cover: "/cover.jpg"
  },
  {
    id: 42, title: "The Unexpected Joy of Being Sober", author: "Catherine Gray",
    price: 8.49, genre: "Humour", inStock: true,
    description: "Gray chronicles her decision to stop drinking and discovers that sober life is far more interesting than she expected. Honest, funny, and genuinely useful, this book manages to be both memoir and self-help without feeling like either. Compulsively readable.",
    cover: "/cover.jpg"
  },
  {
    id: 43, title: "Furiously Happy", author: "Jenny Lawson",
    price: 8.99, genre: "Humour", inStock: true,
    description: "Jenny Lawson's follow-up to her debut is a frank, funny, and frequently bizarre account of living with serious mental illness. She argues that the best response to a broken world is to be furiously, defiantly happy. Taxidermied raccoons feature prominently.",
    cover: "/cover.jpg"
  },
  {
    id: 44, title: "Born a Crime", author: "Trevor Noah",
    price: 9.49, genre: "Humour", inStock: true,
    description: "Trevor Noah grew up mixed-race in apartheid South Africa, where his very existence was illegal. His memoir is simultaneously a history lesson, a love story to his extraordinary mother, and one of the funniest books you will ever read. Extraordinary.",
    cover: "/cover.jpg"
  },
  {
    id: 45, title: "Me Talk Pretty One Day", author: "David Sedaris",
    price: 7.99, genre: "Humour", inStock: false,
    description: "Sedaris chronicles his attempts to learn French in Paris, survive his family, and navigate American eccentricity. His essay collections set the template for personal humour writing and this remains the best entry point. Every piece lands perfectly.",
    cover: "/cover.jpg"
  },
  {
    id: 46, title: "The Sellout", author: "Paul Beatty",
    price: 9.99, genre: "Humour", inStock: true,
    description: "A young Black man from a Los Angeles ghetto ends up before the Supreme Court after attempting to reinstate slavery and segregation in his hometown. Beatty's Booker Prize winner is the most savage satire of American race relations in decades. Bracingly funny.",
    cover: "/cover.jpg"
  },
  {
    id: 47, title: "Small Island", author: "Andrea Levy",
    price: 8.49, genre: "Humour", inStock: true,
    description: "Four characters navigate the collision between Jamaican immigrants and post-war English society in 1948 London. Levy balances comedy and tragedy with remarkable grace. An Orange Prize winner that deserves its place among the great British novels.",
    cover: "/cover.jpg"
  },
  {
    id: 48, title: "The Importance of Being Earnest", author: "Oscar Wilde",
    price: 4.99, genre: "Humour", inStock: true,
    description: "Two gentlemen maintain false identities in order to escape social obligations, leading to an avalanche of mistaken identity, absurd revelations, and the most famous handbag in literary history. Wilde's comic masterpiece is as sparkling as the day it was written.",
    cover: "/cover.jpg"
  },
  {
    id: 49, title: "The Life and Opinions of Tristram Shandy", author: "Laurence Sterne",
    price: 7.49, genre: "Humour", inStock: false,
    description: "Tristram Shandy attempts to write his life story but cannot get past his own birth after several hundred pages. Sterne's eighteenth-century comic novel anticipates postmodernism, metafiction, and the entire tradition of the unreliable narrator. Wildly original.",
    cover: "/cover.jpg"
  },
  {
    id: 50, title: "How to Be Both", author: "Ali Smith",
    price: 9.49, genre: "Humour", inStock: true,
    description: "A grieving teenager in contemporary Cambridge and a fifteenth-century Italian painter find their stories intertwined in this formally inventive novel. Smith's Booker-shortlisted book plays with time, identity, and the nature of art. Funny, moving, and endlessly clever.",
    cover: "/cover.jpg"
  }
];
```

---

## `src/style.css`

```css
:root {
  --accent: #2a9d4e;
  --accent-dark: #228a40;
  --card-img-ratio: 2/3;
}

.card-img-top {
  aspect-ratio: var(--card-img-ratio);
  object-fit: cover;
  width: 100%;
}

.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  cursor: pointer;
}

.card-title:hover {
  color: var(--accent);
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

.book-price {
  color: var(--accent);
  font-weight: 700;
}

.genre-link {
  display: block;
  padding: 0.3rem 0.75rem;
  color: #333;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: border-color 0.15s;
}

.genre-link:hover {
  color: var(--accent);
  border-left-color: var(--accent);
}

.genre-link.active {
  border-left-color: var(--accent);
  font-weight: 600;
  color: var(--accent);
}

.filter-aside {
  min-width: 180px;
  max-width: 180px;
}

.detail-cover {
  max-width: 220px;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.detail-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

@media (max-width: 576px) {
  .detail-layout { flex-direction: column; }
  .detail-cover { max-width: 100%; }
  .filter-aside { min-width: 100%; max-width: 100%; }
}

.page-item.active .page-link {
  background-color: var(--accent);
  border-color: var(--accent);
}

.page-link {
  color: var(--accent);
}

.page-link:hover {
  color: var(--accent-dark);
}

/* ── Debug mode ── */
body.debug nav,
body.debug footer,
body.debug aside,
body.debug section,
body.debug .card,
body.debug .card-body,
body.debug .card-img-top,
body.debug .detail-layout,
body.debug .detail-cover,
body.debug #detail,
body.debug .pagination,
body.debug #genre-list,
body.debug .container,
body.debug .container-fluid {
  border: 2px solid gold !important;
  box-sizing: border-box;
}

body.debug [data-debug-label]::before {
  content: attr(data-debug-label);
  display: block;
  color: purple;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.88);
  padding: 1px 5px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  position: relative;
  z-index: 10;
}
```

---

## `vite.config.js`

Default Vite React config — no changes needed:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

## Running the site

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

## Acceptance Criteria

- `npm run dev` starts with no errors; site opens in browser
- Catalogue page shows 5 book cards per page with cover image, title, author, price, and stock badge
- Genre filter sidebar (Mystery / Humour / All) filters the grid and resets pagination to page 1
- Pagination shows correct page count; Prev/Next disable at boundaries; clicking scrolls to top
- Clicking a card navigates to `/book/{id}` — URL changes, detail page renders the correct book
- Back link on detail page navigates to `/` (React Router `<Link>`, not `history.back()`)
- Document title on detail page changes to the book's title
- Book-not-found route shows a warning with a link back to `/`
- No console errors or React warnings in the browser
- Visual appearance matches the plain-HTML version: dark navbar, green accent colour, card hover scale, genre sidebar with left-border active state
- DEBUG mode: `const DEBUG = true` in `App.jsx` shows gold borders and purple monospace selector labels on all structural elements; set to `false` to disable
