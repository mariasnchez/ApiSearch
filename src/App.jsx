import { useState } from "react";
import "./App.css";
import HomePage from "./HomePage";
import DrugSearch from "./DrugSearch";
import DrugDetail from "./DrugDetail";
import FoodSearch from "./FoodSearch";
import FoodDetail from "./FoodDetail";
import ReactionDetail from "./ReactionDetail";
import TobaccoSearch from "./TobaccoSearch";



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/drug-search" element={<DrugSearch />} />
          <Route path="/drug/:id" element={<DrugDetail />} />
          <Route path="/food-search" element={<FoodSearch />} />
          <Route path="/food/:report_number" element={<FoodDetail />} />
          <Route path="/reaction/:report_number" element={<ReactionDetail />} />
          <Route path="/tobacco-search" element={<TobaccoSearch />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
