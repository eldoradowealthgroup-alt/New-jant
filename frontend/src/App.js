import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import UserProfile from "./pages/UserProfile";
import CitationSearch from "./pages/CitationSearch";
import SearchLoading from "./pages/SearchLoading";
import Results from "./pages/Results";
import CoursesOfAction from "./pages/CoursesOfAction";
import SelfSurrender from "./pages/SelfSurrender";
import PaymentMethods from "./pages/PaymentMethods";
import PaymentForm from "./pages/PaymentForm";
import FederalKiosk from "./pages/FederalKiosk";
import AdminDashboard from "./pages/AdminDashboard";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Initialize state - don't persist across browser sessions for security
  // Users must login each time they visit
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Clear any stale localStorage on app load
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('isAdmin');
  }, []);

  // Custom setUser that also handles logout
  const handleSetUser = (newUser) => {
    setUser(newUser);
  };

  // Custom setIsAdmin that also handles logout
  const handleSetIsAdmin = (newIsAdmin) => {
    setIsAdmin(newIsAdmin);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route 
            path="/" 
            element={
              isAdmin ? <Navigate to="/admin" /> : (user ? <Navigate to="/profile" /> : <Login setUser={handleSetUser} setIsAdmin={handleSetIsAdmin} />)
            } 
          />
          <Route 
            path="/create-account" 
            element={
              user ? <Navigate to="/profile" /> : <CreateAccount setUser={handleSetUser} />
            } 
          />
          <Route 
            path="/profile" 
            element={
              user ? (
                <UserProfile 
                  user={user} 
                  setProfileComplete={setProfileComplete}
                  setUserProfile={setUserProfile}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/search" 
            element={
              user ? (
                <CitationSearch 
                  setSearchData={setSearchData}
                  userProfile={userProfile}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/loading" 
            element={
              searchData ? (
                <SearchLoading 
                  searchData={searchData}
                  setSearchResults={setSearchResults}
                />
              ) : (
                <Navigate to="/search" />
              )
            } 
          />
          <Route 
            path="/results" 
            element={
              searchResults ? (
                <Results results={searchResults} userProfile={userProfile} />
              ) : (
                <Navigate to="/search" />
              )
            } 
          />
          <Route 
            path="/courses-of-action" 
            element={
              <CoursesOfAction userProfile={userProfile} />
            } 
          />
          <Route 
            path="/self-surrender" 
            element={<SelfSurrender />} 
          />
          <Route 
            path="/payment-methods" 
            element={<PaymentMethods />} 
          />
          <Route 
            path="/payment-form" 
            element={<PaymentForm userProfile={userProfile} />} 
          />
          <Route 
            path="/federal-kiosk" 
            element={<FederalKiosk />} 
          />
          <Route 
            path="/admin" 
            element={
              isAdmin ? <AdminDashboard setIsAdmin={handleSetIsAdmin} /> : <Navigate to="/" />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
