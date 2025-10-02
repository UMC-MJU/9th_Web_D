import "./App.css";
import { Link, Route, Routes } from "./hooks";

const LandingPage = () => <h1>DUDU SPA </h1>;
const DUDUPage = () => <h1>두두 페이지</h1>;
const MemoPage = () => <h1>메모장</h1>;
const DiaryPage = () => <h1>일기장</h1>;

const Header = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "10px",
        padding: "20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">HOME</Link>
      <Link to="/dudu">DUDU</Link>
      <Link to="/memo">MEMO</Link>
      <Link to="/diary">DIARY</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" component={LandingPage} />
        <Route path="/dudu" component={DUDUPage} />
        <Route path="/memo" component={MemoPage} />
        <Route path="/diary" component={DiaryPage} />
      </Routes>
    </>
  );
}

export default App;
