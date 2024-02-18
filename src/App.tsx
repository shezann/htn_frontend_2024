import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EventsTable from "./components/EventsTable";
import EventDetails from "./components/EventDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<EventsTable />} />
            <Route path="/login" element={<Login />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
