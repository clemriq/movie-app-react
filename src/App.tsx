import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import ActorDetail from './pages/ActorDetail';
import Category from './pages/Category';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies/:type" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/actor/:id" element={<ActorDetail />} />
            <Route path="/genre/:id" element={<Category />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;