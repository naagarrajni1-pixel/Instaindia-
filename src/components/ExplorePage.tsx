import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, MessageCircle, Sparkles, Film } from 'lucide-react';
import { Post } from '../types';

export const ExplorePage: React.FC = () => {
  const { posts, reels, setActiveDetailPost, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', '#Heritage', '#IndianCouture', '#Architecture', '#Mumbai', '#Kathak', '#Monochrome'];

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      post.caption.toLowerCase().includes(query) ||
      post.user.username.toLowerCase().includes(query) ||
      (post.location && post.location.toLowerCase().includes(query)) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));

    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    return (
      post.tags?.some((t) => t.toLowerCase() === activeCategory.toLowerCase()) ||
      post.caption.toLowerCase().includes(activeCategory.toLowerCase().replace('#', ''))
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 select-none pb-24">
      {/* Search Header */}
      <div className="relative mb-5 max-w-xl mx-auto">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators, hashtags, Rajasthan palaces, couture..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#121212] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors shadow-inner"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Luxury Masonry / Staggered Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {filteredPosts.map((post, index) => {
          const isLarge = index % 5 === 0;
          return (
            <div
              key={post.id}
              onClick={() => setActiveDetailPost(post)}
              className={`relative group bg-[#0e0e0e] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border border-white/10 ${
                isLarge ? 'md:row-span-2 md:col-span-1 min-h-[300px]' : 'aspect-square'
              }`}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${post.filter || ''}`}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 backdrop-blur-[2px]">
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-semibold">@{post.user.username}</span>
                  {post.location && (
                    <span className="text-[10px] text-white/70 truncate max-w-[120px]">
                      {post.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-6 text-white text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/80 line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </div>
          );
        })}

        {/* Feature Reel Card in Explore */}
        {reels.length > 0 && (
          <div
            onClick={() => setActiveTab('reels')}
            className="relative group bg-[#0e0e0e] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border border-white/10 aspect-square flex flex-col justify-end p-4"
          >
            <img
              src={reels[0].posterUrl}
              alt="Reel preview"
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform"
            />
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold tracking-wide">Watch Reel</span>
              </div>
              <span className="text-[11px] font-bold">
                {reels[0].likesCount.toLocaleString()} likes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
