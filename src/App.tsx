import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import RecipePage from './pages/RecipePage';

function App() {
  const path = window.location.pathname;
  
  const renderPage = () => {
    switch (path) {
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      case '/forgot-password':
        return <ForgotPassword />;
      case '/search':
        return <SearchResults />;
      case '/profile':
        return <Profile />;
      case '/recipe':
        return <RecipePage />;
      default:
        if (path.startsWith('/recipe/')) {
          return <RecipePage />;
        }
        return <Home />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          {renderPage()}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;