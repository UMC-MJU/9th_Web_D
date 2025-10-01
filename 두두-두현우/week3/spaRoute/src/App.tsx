import "./App.css";

const DUDUPage = () => <h1>두두 페이지</h1>;
const HomePage = () => <h1>홈 페이지</h1>;
const MemoPage = () => <h1>메모장</h1>;
const DiaryPage = () => <h1>일기장</h1>;

const Header = () => {
  return (
    <nav style={{ display: "flex", gap: "10px" }}>
      <Link to="/dudu">DUDU</Link>
      <Link to="/home">HOME</Link>
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
        <Route path="/dudu" component={DUDUPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/memo" component={MemoPage} />
        <Route path="/diary" component={DiaryPage} />
      </Routes>
    </>
  );
}

export default App;
