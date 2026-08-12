"use client"

import { BlogEditorModal } from "@/components/modals/admin/blog/BlogEditorModal";
import WriteArticleModal from "@/components/modals/admin/blog/WriteArticleModal";
import { blogService, buildBlogFormData } from "@/services/BlogService";
import { Blog } from "@/types/blog";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link'

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [blog, setBlog] = useState({
        title: "",
        subtitle: "",
        BlogCategory: "",
        featuredImage: {
            url: "",
            alt: "",
        },
        content: "",
    });

    const [blogForm, setBlogForm] = useState({
        title: "",
        BlogCategory: "Ecosystem",
        excerpt: "",
        content: "",
    });

    const [featuredImage, setFeaturedImage] = useState<File | null>(null);

    const [saving, setSaving] = useState(false);

    const [statusFilter, setStatusFilter] = useState<
        "all" | "published" | "draft"
    >("all");

    const filteredBlogs = useMemo(() => {
        if (statusFilter === "all") return blogs;

        return blogs.filter(
            (blog) => blog.status === statusFilter
        );
    }, [blogs, statusFilter]);

    async function fetchBlogs() {
        try {
            setLoading(true);

            const response = await blogService.getAdminBlogs({
                limit: 20,
            });

            setBlogs(response.blogs);
        } catch (error) {
            console.error(
                "Failed loading blogs",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const publishedCount = blogs.filter(
        (blog) => blog.status === "published"
    ).length;

    const draftCount = blogs.filter(
        (blog) => blog.status === "draft"
    ).length;

    return (
        <div className="flex min-h-screen text-on-surface">
            {/* Main Content Canvas */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Page Content */}
                <div className="p-8 space-y-8">
                    {/* Hero Header */}
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-display-lg font-bold text-primary -tracking-widest mb-2" style={{ fontSize: '3rem' }}   >
                                Blog Management</h2>
                            <p className="text-body-lg text-on-surface-variant max-w-xl">Curate your ecosystem's voice. Manage
                                sustainable narratives and environmental insights in the Verdant Gallery.</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsArticleModalOpen(true);
                                setSelectedBlog(null); // null means create a new article
                                setIsEditorOpen(true);
                            }}
                            className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-xl hover:bg-primary-container transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">
                                create
                            </span>

                            Write New Article
                        </button>
                    </section>
                    {/* Layout: Bento Grid Style */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Article List (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div>
                                    <h3 className="text-headline-md font-bold text-on-surface">
                                        Recent Articles
                                    </h3>

                                    <p className="mt-1 text-sm text-on-surface-variant">
                                        {blogs.length} article{blogs.length !== 1 && "s"} in your knowledge base
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">

                                    <button
                                        onClick={() => setStatusFilter("all")}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${statusFilter === "all"
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-surface-container hover:bg-surface-container-high"
                                            }`}
                                    >
                                        All ({blogs.length})
                                    </button>

                                    <button
                                        onClick={() => setStatusFilter("published")}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${statusFilter === "published"
                                            ? "bg-emerald-600 text-white shadow-md"
                                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            }`}
                                    >
                                        Published ({publishedCount})
                                    </button>

                                    <button
                                        onClick={() => setStatusFilter("draft")}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${statusFilter === "draft"
                                            ? "bg-amber-500 text-white shadow-md"
                                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                            }`}
                                    >
                                        Drafts ({draftCount})
                                    </button>

                                </div>

                            </div>
                            {/* Article Items (Editorial Card Layout) */}
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="animate-pulse rounded-2xl bg-surface-container-lowest p-4"
                                            >
                                                <div className="flex gap-6">
                                                    <div className="h-28 w-40 rounded-xl bg-surface-container-high" />

                                                    <div className="flex-1 space-y-3">
                                                        <div className="h-5 w-2/3 rounded bg-surface-container-high" />
                                                        <div className="h-4 w-full rounded bg-surface-container-high" />
                                                        <div className="h-4 w-3/4 rounded bg-surface-container-high" />
                                                        <div className="mt-4 h-4 w-32 rounded bg-surface-container-high" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredBlogs.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-low p-14 text-center">
                                        <span className="material-symbols-outlined text-6xl text-outline">
                                            article
                                        </span>

                                        <h3 className="mt-4 text-title-large font-bold">
                                            No blogs yet
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
                                            Your published and draft articles will appear here.
                                            Create your first blog using the form on the left.
                                        </p>
                                    </div>
                                ) : (
                                    filteredBlogs.map((blog) => (
                                        <div
                                            key={blog._id}
                                            onClick={() => {
                                                setSelectedBlog(blog);
                                                setIsEditorOpen(true);
                                            }}
                                            className="
                                                group
                                                cursor-pointer
                                                rounded-2xl
                                                bg-surface-container-lowest
                                                p-4
                                                transition-all
                                                hover:shadow-[0px_24px_48px_rgba(20,29,32,0.08)]
                                            "
                                        >
                                            <div className="flex gap-6">
                                                {/* Image */}
                                                <div className="h-28 w-40 flex-shrink-0 overflow-hidden rounded-xl">
                                                    <img
                                                        src={`${API_URL}/${blog.featuredImage.url}`}
                                                        alt={blog.featuredImage.alt || blog.title}
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                            transition-transform
                                                            duration-500
                                                            group-hover:scale-105
                                                        "
                                                    />
                                                </div>
                                                {/* Content */}
                                                <div className="flex flex-1 flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-4">

                                                            <div>
                                                                <h4
                                                                    className="
                                                                        text-title-lg
                                                                        font-bold
                                                                        text-on-surface
                                                                        transition-colors
                                                                        group-hover:text-primary
                                                                    "
                                                                >
                                                                    {blog.title}
                                                                </h4>

                                                                <p className="mt-1 text-sm text-primary font-medium">
                                                                    {blog.BlogCategory}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-2">

                                                                {blog.featured && (
                                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                                                                        Featured
                                                                    </span>
                                                                )}

                                                                <span
                                                                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${blog.status === "published"
                                                                        ? "bg-primary/10 text-primary"
                                                                        : "bg-slate-200 text-slate-600"
                                                                        }`}
                                                                >
                                                                    {blog.status}
                                                                </span>

                                                                {/*
                                                                  Opens the live rendered post (blog-post page) in a new
                                                                  tab, keyed off the blog's slug. stopPropagation keeps
                                                                  this from also firing any onClick on the card itself.
                                                                */}
                                                                <Link
                                                                    href={`/blog-post/${blog.slug}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="
                                                                        flex
                                                                        h-8
                                                                        w-8
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        text-outline
                                                                        transition-colors
                                                                        hover:bg-primary/10
                                                                        hover:text-primary
                                                                    "
                                                                    title="View live post"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">
                                                                        visibility
                                                                    </span>
                                                                </Link>

                                                            </div>

                                                        </div>
                                                        <p className="mt-2 line-clamp-2 text-label-md text-on-surface-variant">
                                                            {blog.excerpt || blog.content}
                                                        </p>
                                                    </div>
                                                    <div className="mt-5 flex flex-wrap items-center gap-5 text-label-md text-outline">

                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">
                                                                calendar_today
                                                            </span>

                                                            {new Date(
                                                                blog.publishedAt || blog.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>

                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">
                                                                schedule
                                                            </span>

                                                            {blog.status === "published"
                                                                ? "Published"
                                                                : "Draft"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                        {/* Sidebar: Add New / Stats (1/3 width) */}

                        <div className="space-y-8">

                            <div className="rounded-3xl bg-surface-container-low p-8 space-y-6">

                                <div>
                                    <h3 className="text-headline-sm font-bold text-primary">
                                        Quick Draft
                                    </h3>

                                    <p className="mt-1 text-sm text-on-surface-variant">
                                        Create a new article draft.
                                    </p>
                                </div>


                                <form
                                    className="space-y-5"
                                    onSubmit={async (e) => {
                                        e.preventDefault();

                                        if (!featuredImage) {
                                            alert("Featured image is required");
                                            return;
                                        }

                                        try {
                                            setSaving(true);

                                            const formData = new FormData();

                                            formData.append(
                                                "title",
                                                blogForm.title
                                            );

                                            formData.append(
                                                "BlogCategory",
                                                blogForm.BlogCategory
                                            );

                                            formData.append(
                                                "excerpt",
                                                blogForm.excerpt
                                            );

                                            formData.append(
                                                "content",
                                                blogForm.content
                                            );

                                            formData.append(
                                                "status",
                                                "draft"
                                            );

                                            formData.append(
                                                "featuredImage",
                                                featuredImage
                                            );


                                            await blogService.createBlog(formData);

                                            // reset
                                            setBlogForm({
                                                title: "",
                                                BlogCategory: "Ecosystem",
                                                excerpt: "",
                                                content: "",
                                            });

                                            setFeaturedImage(null);
                                            setImagePreview(null);

                                        } catch (err) {
                                            console.error(err);
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                >

                                    {/* Title */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-outline block mb-2 px-1">
                                            Article Title
                                        </label>

                                        <input
                                            value={blogForm.title}
                                            onChange={(e) =>
                                                setBlogForm({
                                                    ...blogForm,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-surface-container-lowest
                                                px-4
                                                py-3
                                                focus:ring-2
                                                focus:ring-primary/20
                                            "
                                            placeholder="Enter headline..."
                                        />
                                    </div>


                                    {/* Category */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-outline block mb-2 px-1">
                                            Category
                                        </label>

                                        <select
                                            value={blogForm.BlogCategory}
                                            onChange={(e) =>
                                                setBlogForm({
                                                    ...blogForm,
                                                    BlogCategory: e.target.value,
                                                })
                                            }
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-surface-container-lowest
                                                px-4
                                                py-3
                                            "
                                        >
                                            <option value="Ecosystem">
                                                Ecosystem
                                            </option>

                                            <option value="Refill Tech">
                                                Refill Tech
                                            </option>

                                            <option value="Community">
                                                Community
                                            </option>
                                        </select>
                                    </div>


                                    {/* Image */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-outline block mb-2 px-1">
                                            Upload Featured Photo
                                        </label>

                                        <label
                                            className="
                                                relative
                                                flex
                                                aspect-video
                                                cursor-pointer
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-2xl
                                                border-2
                                                border-dashed
                                                border-outline-variant/30
                                                bg-surface-container-highest
                                            "
                                        >

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];

                                                    if (file) {
                                                        setFeaturedImage(file);
                                                        setImagePreview(
                                                            URL.createObjectURL(file)
                                                        );
                                                    }
                                                }}
                                            />

                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    className="h-full w-full object-cover"
                                                    alt="preview"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <span className="material-symbols-outlined text-4xl">
                                                        add_a_photo
                                                    </span>

                                                    <p className="text-sm font-bold">
                                                        Choose image
                                                    </p>
                                                </div>
                                            )}

                                        </label>
                                    </div>


                                    {/* Excerpt */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-outline block mb-2 px-1">
                                            Short Description
                                        </label>

                                        <textarea
                                            value={blogForm.excerpt}
                                            onChange={(e) =>
                                                setBlogForm({
                                                    ...blogForm,
                                                    excerpt: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-surface-container-lowest
                                                px-4
                                                py-3
                                            "
                                            placeholder="Brief article summary..."
                                        />
                                    </div>


                                    {/* Content */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-outline block mb-2 px-1">
                                            Content
                                        </label>

                                        <textarea
                                            value={blogForm.content}
                                            onChange={(e) =>
                                                setBlogForm({
                                                    ...blogForm,
                                                    content: e.target.value,
                                                })
                                            }
                                            rows={5}
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-surface-container-lowest
                                                px-4
                                                py-3
                                            "
                                            placeholder="Write article content..."
                                        />
                                    </div>


                                    <button
                                        disabled={saving}
                                        className="
                                            w-full
                                            rounded-2xl
                                            bg-primary
                                            py-4
                                            font-bold
                                            text-white
                                            transition
                                            hover:opacity-90
                                            disabled:opacity-50
                                        "
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Create Draft"}
                                    </button>

                                </form>

                            </div>

                        </div>
                    </div>
                </div>
                {/* Full Modal Placeholder for Rich Editor (Logic Implementation) */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 hidden">
                    <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md"></div>
                    <div
                        className="relative w-full max-w-5xl h-full max-h-[921px] bg-surface rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                        <header className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] uppercase font-black text-primary tracking-widest">New Entry</span>
                                <h2 className="text-headline-md font-bold">Compose Blog Post</h2>
                            </div>
                            <button
                                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-3 gap-12">
                                <div className="col-span-2 space-y-6">
                                    <input
                                        className="w-full text-display-lg font-bold border-none bg-transparent focus:ring-0 p-0 placeholder:opacity-20"
                                        placeholder="Post Title" style={{ fontSize: '3rem' }} type="text" />
                                    <textarea
                                        className="w-full text-title-lg text-on-surface-variant border-none bg-transparent focus:ring-0 p-0 placeholder:opacity-20 italic"
                                        placeholder="Write your subtitle here..." rows={2}></textarea>
                                    <div className="pt-8 border-t border-outline-variant/20">
                                        <div className="flex gap-2 mb-4">
                                            <button className="p-2 rounded hover:bg-surface-container-high"><span
                                                className="material-symbols-outlined">format_bold</span></button>
                                            <button className="p-2 rounded hover:bg-surface-container-high"><span
                                                className="material-symbols-outlined">format_italic</span></button>
                                            <button className="p-2 rounded hover:bg-surface-container-high"><span
                                                className="material-symbols-outlined">format_list_bulleted</span></button>
                                            <button className="p-2 rounded hover:bg-surface-container-high ml-auto"><span
                                                className="material-symbols-outlined">image</span></button>
                                            <button className="p-2 rounded hover:bg-surface-container-high"><span
                                                className="material-symbols-outlined">link</span></button>
                                        </div>
                                        <div className="min-h-[400px] text-body-lg focus:outline-none leading-relaxed text-on-surface/80"
                                            contentEditable suppressContentEditableWarning={true}>
                                            Start telling your story...
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                        <h4 className="text-label-md font-black uppercase text-outline">Publishing Settings</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div
                                                    className="w-5 h-5 rounded border-2 border-primary-container flex items-center justify-center text-on-primary group-hover:bg-primary-container transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                                </div>
                                                <span className="text-label-md font-bold">Featured on Homepage</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group opacity-50">
                                                <div className="w-5 h-5 rounded border-2 border-outline-variant"></div>
                                                <span className="text-label-md font-bold">Allow Comments</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                        <h4 className="text-label-md font-black uppercase text-outline">SEO Preview</h4>
                                        <div
                                            className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                                            <div className="w-full h-24 bg-surface-container-high rounded mb-2"></div>
                                            <div className="h-4 w-3/4 bg-primary/20 rounded mb-2"></div>
                                            <div className="h-3 w-full bg-on-surface-variant/10 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="p-8 bg-surface-container-low flex justify-end gap-4">
                            <button
                                className="px-8 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Save
                                as Draft</button>
                            <button
                                className="px-8 py-3 rounded-full font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Publish
                                Now</button>
                        </footer>
                    </div>
                </div>
            </main >
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">

                    <BlogEditorModal
                        isOpen={isEditorOpen}
                        blog={selectedBlog}
                        onClose={() => setIsEditorOpen(false)}
                        onSaved={(savedBlog) => {
                            fetchBlogs();
                            setIsEditorOpen(false);
                        }}
                    />

                </div>
            )}
        </div >
    );
}