"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyVideoCard } from '@/components/lazy-video-card';
import { Movie } from '@/types/movie';
import { Film, Tv, Sparkles, TrendingUp, Star } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
  icon?: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

export function ContentSection({ title, movies, onMovieSelect, icon, description, isLoading = false }: ContentSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset to page 1 when the movie list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [movies]);

  const paginatedMovies = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of section
    document.getElementById(`section-${title.toLowerCase().replace(/\s+/g, '-')}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <section id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="py-16 mb-12" aria-labelledby={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            {icon}
            <h2 id={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-4xl md:text-5xl font-bold text-gradient">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-xl text-cinema-gray max-w-3xl mx-auto mb-4">
              {description}
            </p>
          )}
          {/* If this is a search result section, show a label with extra margin */}
          {title.toLowerCase().includes('search result') && (
            <div className="w-full flex flex-col items-center">
              <span className="block text-lg font-semibold text-cinema-coral mb-6 mt-2">Search Results</span>
            </div>
          )}
        </motion.div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-20" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cinema-coral"></div>
            <span className="sr-only">Loading content...</span>
          </div>
        )}

        {/* Results Stats */}
        {!isLoading && movies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-8 flex justify-between items-center"
          >
            <p className="text-cinema-gray">
              Showing <span className="text-cinema-coral font-semibold">{paginatedMovies.length}</span> of{' '}
              <span className="text-cinema-teal font-semibold">{movies.length}</span> results
            </p>
            
            {totalPages > 1 && (
              <div className="text-sm text-cinema-gray">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </motion.div>
        )}

        {/* Content Grid */}
        {!isLoading && paginatedMovies.length > 0 ? (
          <>
            {/* Example: Place a button/icon below the label, with spacing */}
            {title.toLowerCase().includes('search result') && (
              <div className="flex justify-center mb-8 mt-2">
                <button className="btn-secondary flex items-center gap-2" aria-label="Refine search results">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
                  Refine Search
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 md:gap-10 mb-8">
              {paginatedMovies.map((movie, index) => (
                <LazyVideoCard
                  key={movie.id}
                  movie={movie}
                  onPlay={onMovieSelect}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 flex justify-center"
              >
                <nav className="flex items-center space-x-2" aria-label="Pagination navigation">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="glass-card px-4 py-2 text-cinema-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
                    aria-label="Go to previous page"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          currentPage === pageNum
                            ? 'bg-cinema-coral text-white'
                            : 'glass-card text-cinema-white hover:bg-white/20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="glass-card px-4 py-2 text-cinema-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
                    aria-label="Go to next page"
                  >
                    Next
                  </button>
                </nav>
              </motion.div>
            )}
          </>
        ) : !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="glass-card-strong p-12 max-w-md mx-auto" role="status">
              <Film className="w-16 h-16 text-cinema-coral mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-cinema-white mb-2" id="no-results-heading">
                No Results Found
              </h3>
              <p className="text-cinema-gray" aria-describedby="no-results-heading">
                Try adjusting your search terms or browse our collection.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}