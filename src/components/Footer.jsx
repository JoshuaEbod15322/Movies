import React from "react";
import { Link } from "react-router-dom";
import { GENRES } from "../constants";

export default function Footer() {
  return (
    <footer className="bg-black/95 border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-white text-lg font-bold">PTMovies</p>
            <p className="text-sm text-gray-400 mt-2">
              The ultimate destination for movie enthusiasts. Stream thousands
              of titles, from the latest blockbusters to timeless classics, all
              in stunning high definition.
            </p>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>© {new Date().getFullYear()} PTMovies.</p>
            <p>
              <Link
                to="/contact"
                className="text-red-600 hover:text-red-500 transition-colors"
              >
                Contact me
              </Link>
            </p>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-4">Explore</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
            {GENRES.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}/${encodeURIComponent(genre.name)}`}
                className="hover:text-white transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-4">Contact</p>
          <div className="space-y-3 text-sm text-gray-400">
            <div>
              <p className="font-medium text-gray-200">Email</p>
              <a className="hover:text-white transition-colors">
                joshuaebod.202300287@gmail.com
              </a>
            </div>
            <div>
              <p className="font-medium text-gray-200">Phone</p>
              <p>+639365844458</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
