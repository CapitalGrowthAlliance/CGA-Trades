import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import ExpandableImage from '../components/ExpandableImage';
import { blogPosts } from '../data/blogData';

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <button 
          onClick={() => navigate('/blog')}
          className="text-accent-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== id && p.category === post.category).slice(0, 3);
  if (relatedPosts.length < 3) {
    const morePosts = blogPosts.filter(p => p.id !== id && !relatedPosts.includes(p)).slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...morePosts);
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block hover:bg-accent-primary hover:text-slate-900 transition-colors">
              {post.category}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm border-b border-border-light pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-semibold text-text-primary">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex items-center gap-3 ml-auto">
                <span className="font-medium mr-2 hidden sm:block">Share:</span>
                <button className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden mb-12 border border-border-light shadow-2xl">
            <ExpandableImage 
              src={post.image} 
              alt={post.title} 
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <p className="text-xl text-text-secondary leading-relaxed mb-8 font-medium">
              {post.content.intro}
            </p>
            
            {post.content.sections.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-bold mt-12 mb-6 text-white">{section.heading}</h2>
                
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-text-secondary leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
                
                {section.quote && (
                  <blockquote className="border-l-4 border-accent-primary pl-6 py-2 my-8 bg-accent-primary/5 rounded-r-xl italic text-lg text-white">
                    "{section.quote}"
                  </blockquote>
                )}
                
                {section.list && (
                  <ul className="list-disc pl-6 text-text-secondary space-y-3 mb-8">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            
            <div className="mt-12 p-8 bg-bg-secondary border border-border-light rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">Conclusion</h3>
              <p className="text-text-secondary leading-relaxed m-0">
                {post.content.conclusion}
              </p>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-bg-secondary border border-border-light rounded-2xl p-8 mb-16 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-accent-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2">Written by {post.author}</h3>
              <p className="text-text-secondary text-sm mb-4">
                Senior Market Analyst and Quantitative Researcher at Capital Growth Alliance. Specializing in algorithmic trading strategies and decentralized finance protocols.
              </p>
              <button className="text-accent-primary font-bold text-sm hover:underline">
                View all posts by {post.author}
              </button>
            </div>
          </div>

          {/* Related Posts */}
          <div className="border-t border-border-light pt-12">
            <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group block">
                  <div className="bg-bg-secondary border border-border-light rounded-xl overflow-hidden h-full flex flex-col hover:border-accent-primary/50 transition-colors">
                    <div className="h-32 overflow-hidden">
                      <ExpandableImage 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs text-accent-primary font-bold mb-2 uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-bold text-sm mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-text-muted">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
