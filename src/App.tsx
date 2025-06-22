import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import ActorDetail from './pages/ActorDetail';
import Category from './pages/Category';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-black">
        <Header />
        <main className="flex-grow bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies/:type" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/actor/:id" element={<ActorDetail />} />
            <Route path="/genre/:id" element={<Category />} />
            <Route path="/search" element={<Search />} />
            {/* Redirection pour toutes les autres routes vers l'accueil */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;