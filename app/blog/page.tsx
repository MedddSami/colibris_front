'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useEffect, useState } from 'react'
import { Blog } from '@/types/blog'
import { blogService } from '@/services/BlogService'
import Link from 'next/link'

export default function BlogPage() {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const [showMore, setShowMore] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchBlogs() {
    try {
      setLoading(true);

      const response = await blogService.getBlogs({
        limit: 100,
        status: "published",
      });

      setBlogs(response.blogs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = [
    "All",
    ...new Set(blogs.map(blog => blog.BlogCategory))
  ];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(
        blog =>
          blog.BlogCategory === selectedCategory
      );

  const featuredBlog =
    blogs.find(blog => blog.featured) ?? blogs[0];

  const regularBlogs = filteredBlogs.filter(
    blog => blog._id !== featuredBlog?._id
  );

  const remainingBlogs = blogs.slice(5);

  const remaining = blogs.filter(
    blog => blog._id !== featuredBlog?._id
  );

  const sideBlog = remaining[0];
  const gridBlogs = remaining.slice(1, 4);

  const discoverBlogs = remaining.slice(4, 7);

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen max-w-[1440px] mx-auto px-1 pt-24">
        {/* Hero */}
        <header className="mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-primary font-bold tracking-widest text-[0.75rem] uppercase mb-4 block">The Journal</span>
            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
              Curating the future of <span className="text-primary">Sustainable Living.</span>
            </h1>
          </div>
          <p className="max-w-md text-lg text-on-surface-variant leading-relaxed pb-2">
            Deep dives into circular economy, biophilic design, and the conscious management of our shared ecosystem.
          </p>
        </header>
        {/* Category Filters (Bio-Chips) */}
        <div className="flex flex-wrap gap-3 mb-16">
          <button
            className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold transition-all hover:opacity-90"
          >
            All Articles
          </button>
          <button
            className="px-6 py-2 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all"
          >
            Circular Economy
          </button>
          <button
            className="px-6 py-2 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all"
          >
            Sustainable Management
          </button>
          <button
            className="px-6 py-2 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all"
          >
            Brand News
          </button>
          <button
            className="px-6 py-2 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all"
          >
            Innovation
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-12 mb-32">
          {blogs.length > 0 && (
            <Link
              href={`/blog-post/${featuredBlog.slug}`}
              className="md:col-span-8 group block cursor-pointer"
            >
              <article>
                <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-8 bg-surface-container">
                  <img
                    src={`${API_URL}/${featuredBlog.featuredImage.url}`}
                    alt={featuredBlog.featuredImage.alt || featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-surface/90 backdrop-blur-md text-primary text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {featuredBlog.BlogCategory}
                    </span>

                    {blogs[0].featured && (
                      <span className="bg-primary text-on-primary text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-[2rem] font-bold leading-tight text-on-surface mb-4 group-hover:text-primary transition-colors">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-lg text-on-surface-variant mb-6 line-clamp-3">
                    {featuredBlog.excerpt ||
                      featuredBlog.subtitle ||
                      featuredBlog.content.replace(/<[^>]*>/g, "").slice(0, 180) + "..."}
                  </p>

                  <div className="flex items-center gap-2 text-primary font-bold">
                    Read full story
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )}
          {/* Side Post 1 */}
          {sideBlog && (
            <Link
              href={`/blog-post/${sideBlog.slug}`}
              className="md:col-span-4 flex flex-col group cursor-pointer pt-12 md:pt-0"
            >
              <article className="flex h-full flex-col">
                <div className="relative overflow-hidden rounded-xl aspect-square mb-6 bg-surface-container">
                  <img
                    src={`${API_URL}/${sideBlog.featuredImage.url}`}
                    alt={sideBlog.featuredImage.alt || sideBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="bg-surface/90 backdrop-blur-md text-primary text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {sideBlog.BlogCategory}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {sideBlog.title}
                </h3>

                <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-3">
                  {sideBlog.excerpt ||
                    sideBlog.subtitle ||
                    sideBlog.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..."}
                </p>

                <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                  Read more
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>
          )}
          {/* Middle Row Grid (Standard Trio) */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            {gridBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog-post/${blog.slug}`}
                className="group block cursor-pointer"
              >
                <article className="h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-6 bg-surface-container">
                    <img
                      src={`${API_URL}/${blog.featuredImage.url}`}
                      alt={blog.featuredImage.alt || blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-4 left-4">
                      <span className="bg-surface/90 backdrop-blur-md text-primary text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {blog.BlogCategory}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">
                    {blog.excerpt ||
                      blog.subtitle ||
                      blog.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..."}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                    Read more
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Article 
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <Card className="overflow-hidden lg:grid lg:grid-cols-2 gap-8">
            <img
              src={ARTICLES[0].img}
              alt={ARTICLES[0].title}
              className="w-full h-64 lg:h-full object-cover"
            />
            <div className="p-8 lg:p-0 flex flex-col justify-center">
              <Badge variant="primary" className="w-fit mb-4">
                Featured
              </Badge>
              <h2 className="text-4xl font-bold text-neutral mb-4">{ARTICLES[0].title}</h2>
              <p className="text-neutral/70 text-lg mb-6">{ARTICLES[0].excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-neutral/60 mb-8">
                <span>{ARTICLES[0].date}</span>
                <span>•</span>
                <span>{ARTICLES[0].readTime}</span>
              </div>
              <Button variant="primary" size="lg" className="w-fit">
                Read Article
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          </Card>
        </section>*/}


        {/* Pagination / Load More */}
        {discoverBlogs.length > 0 && !showMore && (
          <div className="flex justify-center mb-32">
            <button
              onClick={() => setShowMore(true)}
              className="group flex items-center gap-4 px-10 py-4 bg-surface-container text-on-surface font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300"
            >
              Discover More Stories
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
                expand_more
              </span>
            </button>
          </div>
        )}
        {showMore && discoverBlogs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {discoverBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog-post/${blog.slug}`}
                  className="group block"
                >
                  <article className="h-full flex flex-col">
                    <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-6 bg-surface-container">
                      <img
                        src={`${API_URL}/${blog.featuredImage.url}`}
                        alt={blog.featuredImage.alt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute top-4 left-4">
                        <span className="bg-surface/90 backdrop-blur-md text-primary text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {blog.BlogCategory}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">
                      {blog.excerpt ||
                        blog.subtitle ||
                        blog.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..."}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                      Read more
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Subscription (Glassmorphism Bento Style) 
        <section className="mb-32 bg-surface-container-low rounded-[2rem] p-12 relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[2.5rem] font-bold leading-tight mb-6">Stay rooted in the <br /><span
                className="text-primary">latest insights.</span></h2>
              <p className="text-lg text-on-surface-variant">Join 20,000+ conscious professionals receiving our weekly digest on
                sustainable management.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
              <div className="flex flex-col gap-4">
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface"
                  placeholder="your@email.com" type="email" />
                <button
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Subscribe
                  to Journal</button>
              </div>
              <p className="mt-4 text-[0.7rem] text-slate-400 text-center uppercase tracking-widest font-medium">No spam. Only
                growth.</p>
            </div>
          </div>*/}
        {/* Decorative biophilic element
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[80px]"></div>
        </section> */}
      </main>
      <Footer />
    </>
  )
}
