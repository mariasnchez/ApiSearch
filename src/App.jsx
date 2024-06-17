import { useState } from "react";
import "./App.css";
import DrugSearch from "./DrugSearch";
import DrugDetail from "./DrugDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DrugSearch />} />
          <Route path="/drug/:id" element={<DrugDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
