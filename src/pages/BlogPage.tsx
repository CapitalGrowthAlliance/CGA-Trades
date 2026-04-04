import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, TrendingUp, Shield, Lightbulb, ArrowRight, Calendar, User, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import ExpandableImage from '../components/ExpandableImage';
import { blogPosts } from '../data/blogData';

export default function BlogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const categories = ['All', 'Investment Tips', 'Technology', 'Financial Education', 'Platform Updates'];

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] -z-10"></div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Market <span className="text-accent-primary">Intelligence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[8px] leading-relaxed sm:text-xs md:text-lg text-text-secondary w-full md:max-w-2xl mx-auto"
          >
            Expert analysis, trading strategies, platform updates, and deep dives into the future of decentralized finance and algorithmic trading.
          </motion.p>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-12"
        >
          <div className="flex items-center justify-center gap-2 w-full md:w-auto">
            {categories.slice(0, 3).map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-accent-primary text-slate-900 shadow-[0_0_15px_rgba(200,255,0,0.3)]' 
                    : 'bg-bg-secondary border border-border-light text-text-secondary hover:text-accent-primary hover:border-accent-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 w-full md:w-auto">
            {categories.slice(3, 5).map((cat, i) => (
              <button
                key={i + 3}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-accent-primary text-slate-900 shadow-[0_0_15px_rgba(200,255,0,0.3)]' 
                    : 'bg-bg-secondary border border-border-light text-text-secondary hover:text-accent-primary hover:border-accent-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-text-secondary">No articles found in this category.</h3>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <Link to={`/blog/${featuredPost.id}`} className="group block">
                  <div className="relative rounded-3xl overflow-hidden border border-border-light bg-bg-secondary grid grid-cols-1 lg:grid-cols-2 group-hover:border-accent-primary/50 transition-colors duration-500">
                    <div className="h-64 lg:h-auto overflow-hidden">
                      <ExpandableImage 
                        src={featuredPost.image} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-bold rounded-full uppercase tracking-wider">
                          {featuredPost.category}
                        </span>
                        <span className="text-text-muted text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {featuredPost.date}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent-primary transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-text-secondary text-lg mb-8 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                            <User className="w-5 h-5 text-text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{featuredPost.author}</p>
                            <p className="text-xs text-text-muted">{featuredPost.readTime}</p>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary group-hover:text-slate-900 transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {gridPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${post.id}`} className="group block h-full">
                      <div className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden h-full flex flex-col hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/5 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                          <ExpandableImage 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                            {post.category}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.date}</span>
                            <span className="mx-1">•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 group-hover:text-accent-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-text-secondary text-sm mb-6 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                            <span className="text-sm font-semibold">{post.author}</span>
                            <span className="text-accent-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-[80px] -z-10"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply These Insights?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of investors utilizing our advanced algorithmic trading platform to generate consistent daily returns.
          </p>
          <button 
            onClick={() => navigate('/invest')}
            className="px-8 py-4 bg-accent-primary text-slate-900 rounded-xl font-bold hover:bg-[#b3e600] transition-colors shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 duration-300"
          >
            Explore Investment Plans
          </button>
        </motion.div>
      </div>
    </div>
  );
}
