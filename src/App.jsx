import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Anime from "./pages/Anime";
import KDrama from "./pages/KDrama";
import Western from "./pages/Western";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import GenrePage from "./pages/GenrePage";
import Watch from "./pages/Watch";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVSeries />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/kdrama" element={<KDrama />} />
            <Route path="/western" element={<Western />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/genre/:genreId/:genreName" element={<GenrePage />} />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/:type/:id" element={<MovieDetails />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}
