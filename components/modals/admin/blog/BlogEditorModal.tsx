'use client'

import { useEffect, useRef, useState } from 'react'
import {
    blogService,
    buildBlogFormData,
} from '@/services/BlogService'
import { Blog, BlogBlock, BlogStatus } from '@/types/blog'

// Shared category list (merged from the public blog page and the original
// admin mock). BlogCategory is a free-text field on the backend, so feel
// free to add/remove entries here without touching the API.
export const BLOG_CATEGORIES = [
    'Ecosystem',
    'Refill Tech',
    'Community',
    'Education',
    'Impact',
    'Lifestyle',
    'Tips',
]

// Local draft shape for the block editor. Mirrors BlogBlock but keeps a
// stable `id` for React keys, and flattens the nested image object so plain
// <input>s can bind to it directly.
interface BlockDraft {
    id: string
    type: BlogBlock['type']
    text: string
    level: number
    imageUrl: string
    imageAlt: string
}

const BLOCK_TYPES: BlogBlock['type'][] = ['paragraph', 'heading', 'quote', 'image', 'list']

function makeBlockId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `block-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function blockToDraft(block: BlogBlock): BlockDraft {
    return {
        id: makeBlockId(),
        type: block.type,
        text: block.text ?? '',
        level: block.level ?? 2,
        imageUrl: block.image?.url ?? '',
        imageAlt: block.image?.alt ?? '',
    }
}

function draftToBlock(draft: BlockDraft): BlogBlock {
    if (draft.type === 'image') {
        return { type: 'image', image: { url: draft.imageUrl, alt: draft.imageAlt } }
    }
    if (draft.type === 'heading') {
        return { type: 'heading', text: draft.text, level: draft.level }
    }
    return { type: draft.type, text: draft.text }
}

interface BlogEditorModalProps {
    isOpen: boolean
    blog: Blog | null // null = creating a new post, otherwise editing this one
    onClose: () => void
    onSaved: (blog: Blog) => void
}

export function BlogEditorModal({ isOpen, blog, onClose, onSaved }: BlogEditorModalProps) {
    const isEditing = !!blog
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [category, setCategory] = useState(BLOG_CATEGORIES[0])
    const [content, setContent] = useState('')
    const [blocks, setBlocks] = useState<BlockDraft[]>([])
    const [featured, setFeatured] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Reset / seed the form every time the modal opens (or the target blog changes)
    useEffect(() => {
        if (!isOpen) return

        setTitle(blog?.title ?? '')
        setSubtitle(blog?.subtitle ?? '')
        setExcerpt(blog?.excerpt ?? '')
        setCategory(blog?.BlogCategory ?? BLOG_CATEGORIES[0])
        setContent(blog?.content ?? '')
        setBlocks((blog?.blocks ?? []).map(blockToDraft))
        setFeatured(blog?.featured ?? false)
        setImageFile(null)
        setImagePreview(
            blog?.featuredImage?.url
                ? `${API_URL}/${blog.featuredImage.url}`
                : null
        );
        setError(null)
        setSubmitting(false)
    }, [isOpen, blog])

    if (!isOpen) return null

    const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const addBlock = (type: BlogBlock['type']) => {
        setBlocks((prev) => [
            ...prev,
            { id: makeBlockId(), type, text: '', level: 2, imageUrl: '', imageAlt: '' },
        ])
    }

    const updateBlock = (id: string, patch: Partial<BlockDraft>) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    }

    const removeBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id))
    }

    const handleSubmit = async (status: BlogStatus) => {
        setError(null)

        if (!title.trim() || !content.trim() || !category) {
            setError('Title, content, and category are required.')
            return
        }
        if (!isEditing && !imageFile) {
            setError('A featured image is required.')
            return
        }
        const hasEmptyBlock = blocks.some((b) =>
            b.type === 'image' ? !b.imageUrl.trim() : !b.text.trim()
        )
        if (hasEmptyBlock) {
            setError('Every block needs its text (or image URL) filled in, or remove it.')
            return
        }

        setSubmitting(true)
        try {
            const formData = buildBlogFormData({
                title,
                subtitle: subtitle || undefined,
                excerpt: excerpt || undefined,
                BlogCategory: category,
                content,
                status,
                featured,
                blocks: blocks.length > 0 ? blocks.map(draftToBlock) : undefined,
                featuredImage: imageFile ?? undefined,
            })

            const savedBlog = isEditing
                ? await blogService.updateBlog(blog!._id, formData)
                : (await blogService.createBlog(formData)).blog

            onSaved(savedBlog)
            onClose()
        } catch (err) {
            setError('Something went wrong while saving. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-5xl h-full max-h-[921px] bg-surface rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                <header className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] uppercase font-black text-primary tracking-widest">
                            {isEditing ? 'Edit Entry' : 'New Entry'}
                        </span>
                        <h2 className="text-headline-md font-bold">
                            {isEditing ? 'Edit Blog Post' : 'Compose Blog Post'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Main column: title, subtitle, excerpt, fallback content, blocks */}
                        <div className="md:col-span-2 space-y-6">
                            <input
                                className="w-full text-display-lg font-bold border-none bg-transparent focus:ring-0 p-0 placeholder:opacity-20"
                                placeholder="Post Title"
                                style={{ fontSize: '3rem' }}
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full text-title-lg text-on-surface-variant border-none bg-transparent focus:ring-0 p-0 placeholder:opacity-20 italic resize-none"
                                placeholder="Write your subtitle here..."
                                rows={2}
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            ></textarea>

                            <div>
                                <label className="text-[10px] uppercase font-black text-outline block mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    className="w-full text-body-lg text-on-surface-variant border-l-4 border-primary/30 bg-transparent focus:ring-0 px-4 py-1 italic resize-none"
                                    placeholder="A short pull-quote shown at the top of the article..."
                                    rows={2}
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="pt-8 border-t border-outline-variant/20 space-y-2">
                                <label className="text-[10px] uppercase font-black text-outline block">
                                    Content
                                </label>
                                <p className="text-[11px] text-outline">
                                    Required. Rendered on the article page only if no blocks are added below.
                                </p>
                                <textarea
                                    className="w-full min-h-[200px] text-body-lg focus:outline-none leading-relaxed text-on-surface/80 bg-transparent border-none resize-none placeholder:opacity-30"
                                    placeholder="Start telling your story..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Structured blocks editor — mirrors the switch statement in
                                app/blog-post/page.tsx (heading, quote, image, and a
                                paragraph/list fallback) so what you build here renders
                                the way you'd expect on the live article. */}
                            <div className="pt-8 border-t border-outline-variant/20 space-y-4">
                                <label className="text-[10px] uppercase font-black text-outline block">
                                    Structured Blocks (optional)
                                </label>

                                <div className="space-y-4">
                                    {blocks.map((block) => (
                                        <div
                                            key={block.id}
                                            className="bg-surface-container-low rounded-2xl p-4 space-y-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <select
                                                    className="bg-surface-container-lowest border-none rounded-lg px-3 py-2 text-label-md font-bold"
                                                    value={block.type}
                                                    onChange={(e) =>
                                                        updateBlock(block.id, {
                                                            type: e.target.value as BlogBlock['type'],
                                                        })
                                                    }
                                                >
                                                    {BLOCK_TYPES.map((t) => (
                                                        <option key={t} value={t}>
                                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => removeBlock(block.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>

                                            {block.type === 'image' ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <input
                                                        className="w-full bg-surface-container-lowest border-none rounded-lg px-3 py-2 text-body-md"
                                                        placeholder="Image URL"
                                                        value={block.imageUrl}
                                                        onChange={(e) =>
                                                            updateBlock(block.id, { imageUrl: e.target.value })
                                                        }
                                                    />
                                                    <input
                                                        className="w-full bg-surface-container-lowest border-none rounded-lg px-3 py-2 text-body-md"
                                                        placeholder="Alt text"
                                                        value={block.imageAlt}
                                                        onChange={(e) =>
                                                            updateBlock(block.id, { imageAlt: e.target.value })
                                                        }
                                                    />
                                                    {/*
                                                      Note: the backend only accepts one uploaded file
                                                      (the featured image) per request, so block images
                                                      are referenced by URL rather than uploaded here.
                                                    */}
                                                </div>
                                            ) : (
                                                <textarea
                                                    className="w-full bg-surface-container-lowest border-none rounded-lg px-3 py-2 text-body-md resize-none"
                                                    placeholder={
                                                        block.type === 'heading'
                                                            ? 'Heading text'
                                                            : block.type === 'quote'
                                                                ? 'Quote text'
                                                                : 'Paragraph text'
                                                    }
                                                    rows={block.type === 'heading' ? 1 : 3}
                                                    value={block.text}
                                                    onChange={(e) =>
                                                        updateBlock(block.id, { text: e.target.value })
                                                    }
                                                ></textarea>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {BLOCK_TYPES.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => addBlock(t)}
                                            className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-label-md font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar column: category, image, publishing */}
                        <div className="space-y-8">
                            <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                <h4 className="text-label-md font-black uppercase text-outline">Category</h4>
                                <select
                                    className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-body-lg"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {BLOG_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                <h4 className="text-label-md font-black uppercase text-outline">Featured Image</h4>
                                <div
                                    className="w-full aspect-video bg-surface-container-highest rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 text-outline hover:text-primary hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-4xl mb-2">
                                                add_a_photo
                                            </span>
                                            <span className="text-label-md font-bold">Upload Featured Photo</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    className="hidden"
                                    onChange={handleImagePick}
                                />
                                {isEditing && (
                                    <p className="text-[11px] text-outline">Leave as-is to keep the current photo.</p>
                                )}
                            </div>

                            <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                <h4 className="text-label-md font-black uppercase text-outline">Publishing Settings</h4>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-primary-container accent-primary"
                                    />
                                    <span className="text-label-md font-bold">Featured on Homepage</span>
                                </label>
                            </div>

                            {/* Live SEO-card preview, matching the placeholder in the
                                original mock, using the actual title/excerpt/image */}
                            <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                                <h4 className="text-label-md font-black uppercase text-outline">SEO Preview</h4>
                                <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-2">
                                    <div className="w-full h-24 bg-surface-container-high rounded overflow-hidden">
                                        {imagePreview && (
                                            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <p className="text-body-md font-bold text-primary truncate">
                                        {title || 'Post Title'}
                                    </p>
                                    <p className="text-label-md text-on-surface-variant line-clamp-2">
                                        {excerpt || subtitle || 'A short description will appear here.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                </div>

                <footer className="p-8 bg-surface-container-low flex justify-end gap-4">
                    <button
                        disabled={submitting}
                        onClick={() => handleSubmit('draft')}
                        className="px-8 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
                    >
                        Save as Draft
                    </button>
                    <button
                        disabled={submitting}
                        onClick={() => handleSubmit('published')}
                        className="px-8 py-3 rounded-full font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Publish Now'}
                    </button>
                </footer>
            </div>
        </div>
    )
}