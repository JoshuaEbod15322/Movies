import React from "react";
import { X, TrendingUp, Film, Tv, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TopMovieCard from "./TopMovieCard";

export default function TopListModal({ isOpen, onClose, title, items, type }) {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case "trending today":
        return <TrendingUp className="text-red-600" size={24} />;
      case "latest movies":
        return <Film className="text-red-600" size={24} />;
      case "latest tv series":
        return <Tv className="text-red-600" size={24} />;
      case "latest anime":
        return <Sparkles className="text-red-600" size={24} />;
      default:
        return <TrendingUp className="text-red-600" size={24} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-1">
                <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
                  <span className="text-red-600 ml-2">Top 10 </span> {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {items.slice(0, 10).map((item, index) => (
                  <TopMovieCard
                    key={item.id}
                    item={item}
                    rank={index + 1}
                    type={type}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
