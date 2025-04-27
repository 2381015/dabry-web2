import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import BooksList from './pages/admin/BooksList';
import BookForm from './pages/admin/BookForm';
import UsersList from './pages/admin/UsersList';
import AuthorsList from './pages/admin/AuthorsList';
import LoansList from './pages/admin/LoansList';
import LoanForm from './pages/admin/LoanForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route path="books" element={<BooksList />} />
              <Route path="books/add" element={<BookForm />} />
              <Route path="books/edit/:id" element={<BookForm />} />
              <Route path="users" element={<UsersList />} />
              <Route path="authors" element={<AuthorsList />} />
              <Route path="loans" element={<LoansList />} />
              <Route path="loans/add" element={<LoanForm />} />
              <Route path="loans/edit/:id" element={<LoanForm />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
