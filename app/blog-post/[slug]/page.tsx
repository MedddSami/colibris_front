'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { blogService } from '@/services/BlogService'
import { Blog } from '@/types/blog'

function estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
}

function formatDate(dateString?: string | null): string {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default function BlogPostPage() {
    const params = useParams<{ slug: string }>()
    const slug = params?.slug

    const [blog, setBlog] = useState<Blog | null>(null)
    const [related, setRelated] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!slug) return

        let isMounted = true

        const fetchBlog = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await blogService.getBlogBySlug(slug)
                if (!isMounted) return
                setBlog(data)

                // Pull a couple of related posts from the same category
                const { blogs } = await blogService.getBlogs({
                    category: data.BlogCategory,
                    status: 'published',
                    limit: 3,
                })
                if (!isMounted) return
                setRelated(blogs.filter((b) => b._id !== data._id).slice(0, 2))
            } catch (err) {
                if (!isMounted) return
                setError('This blog post could not be found.')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchBlog()

        return () => {
            isMounted = false
        }
    }, [slug])

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="pt-20 bg-white min-h-screen flex items-center justify-center">
                    <p className="text-neutral-600">Loading article...</p>
                </main>
                <Footer />
            </>
        )
    }

    if (error || !blog) {
        return (
            <>
                <Navbar />
                <main className="pt-20 bg-white min-h-screen flex items-center justify-center">
                    <p className="text-neutral-600">{error ?? 'Blog post not found.'}</p>
                </main>
                <Footer />
            </>
        )
    }

    const readTime = estimateReadTime(blog.content)
    const dateLabel = formatDate(blog.publishedAt ?? blog.createdAt)

    return (
        <>
            <Navbar />
            <main className="pt-20 bg-surface min-h-screen">
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-12 text-sm text-neutral-700 font-medium">
                        <Link className="hover:text-primary-700 transition-colors" href="/blog">
                            Blog
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link
                            className="hover:text-primary-700 transition-colors"
                            href={`/blog?category=${encodeURIComponent(blog.BlogCategory)}`}
                        >
                            {blog.BlogCategory}
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-neutral-900 truncate max-w-[200px] md:max-w-none">
                            {blog.title}
                        </span>
                    </nav>

                    {/* Hero Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
                        <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={`${API_URL}/${blog.featuredImage.url}`}
                                alt={blog.featuredImage.alt || blog.title}
                                className="w-full aspect-[16/10] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>

                        <div className="lg:col-span-4 lg:mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary text-sm font-bold mb-6">
                                {blog.BlogCategory}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight mb-8">
                                {blog.title}
                            </h1>
                            {blog.subtitle && (
                                <p className="text-lg text-neutral-600 mb-4">{blog.subtitle}</p>
                            )}
                            <div className="flex items-center gap-4 border-t border-neutral-200/30 pt-8">
                                {/*
                                  NOTE: the current backend schema has no author field.
                                  Add an `author` ref (e.g. to a User model) if you want
                                  the author card/byline back — happy to wire it up.
                                */}
                                <p className="text-sm text-neutral-700">
                                    {dateLabel}
                                    {dateLabel && ' • '}
                                    {readTime} min read
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                        {/* Article Content */}
                        <article className="lg:col-span-8 space-y-8">
                            {blog.excerpt && (
                                <p className="text-xl text-neutral-600 font-medium leading-relaxed italic border-l-4 border-primary pl-8">
                                    {blog.excerpt}
                                </p>
                            )}

                            {blog.blocks && blog.blocks.length > 0 ? (
                                blog.blocks.map((block, i) => {
                                    switch (block.type) {
                                        case 'heading':
                                            return (
                                                <h2
                                                    key={i}
                                                    className="text-3xl font-bold text-neutral-900 mt-8 mb-4"
                                                >
                                                    {block.text}
                                                </h2>
                                            )
                                        case 'quote':
                                            return (
                                                <blockquote
                                                    key={i}
                                                    className="text-xl text-neutral-600 italic border-l-4 border-primary pl-8"
                                                >
                                                    {block.text}
                                                </blockquote>
                                            )
                                        case 'image':
                                            return (
                                                <img
                                                    key={i}
                                                    src={block.image?.url ? `${API_URL}/${block.image.url}` : ""}
                                                    alt={block.image?.alt || ""}
                                                    className="w-full rounded-xl"
                                                />
                                            )
                                        default:
                                            return (
                                                <p key={i} className="text-neutral-600 leading-relaxed">
                                                    {block.text}
                                                </p>
                                            )
                                    }
                                })
                            ) : (
                                // Assumes `content` is HTML from a rich text editor.
                                // If it's markdown/plain text instead, swap this for a
                                // markdown renderer or plain <p> rendering.
                                <div
                                    className="text-neutral-600 leading-relaxed space-y-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:mt-8 [&_h2]:mb-4"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            )}
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Related Articles */}
                            {related.length > 0 && (
                                <div className="bg-neutral-100 rounded-xl p-8">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-6">
                                        Related Articles
                                    </h3>
                                    <div className="space-y-6">
                                        {related.map((item) => (
                                            <Link
                                                key={item._id}
                                                href={`/blog/${item.slug}`}
                                                className="block group hover:translate-x-1 transition-transform"
                                            >
                                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary-700 text-xs font-bold mb-2">
                                                    {item.BlogCategory}
                                                </span>
                                                <p className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                                    {item.title}
                                                </p>
                                                <p className="text-sm text-neutral-700 mt-1">
                                                    {formatDate(item.publishedAt ?? item.createdAt)}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}