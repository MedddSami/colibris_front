"use client";

import { useState } from "react";

interface BlogForm {
    title: string;
    subtitle: string;
    BlogCategory: string;
    featuredImage: {
        url: string;
        alt: string;
    };
    content: string;
    seo?: {
        keywords?: string[];
    };
}

interface WriteArticleModalProps {
    form: BlogForm;
    setForm: React.Dispatch<React.SetStateAction<BlogForm>>;
    onSaveDraft?: () => void;
    onPublish?: () => void;
    onClose?: () => void;
}

export default function WriteArticleModal({
    form,
    setForm,
    onSaveDraft,
    onPublish,
    onClose,
}: WriteArticleModalProps) {
    const [tags, setTags] = useState<string[]>([
        "Sustainability",
        "Wildlife",
    ]);

    const [tagInput, setTagInput] = useState("");

    const updateField = (
        field: keyof BlogForm,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const addTag = () => {
        if (!tagInput.trim()) return;

        setTags((prev) => [...prev, tagInput]);
        setTagInput("");
    };


    const removeTag = (tag: string) => {
        setTags((prev) =>
            prev.filter((item) => item !== tag)
        );
    };


    return (
        <div className="bg-surface-container-lowest w-full max-w-5xl max-h-[921px] rounded-3xl shadow-[0px_24px_64px_rgba(20,29,32,0.12)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10">
                <div>
                    <h3 className="text-2xl font-bold text-on-surface">
                        Write New Article
                    </h3>

                    <p className="text-sm text-on-surface-variant mt-1">
                        Drafting in Sustainability Hub
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    <button
                        onClick={onSaveDraft}
                        className="px-5 py-2.5 rounded-full text-primary font-bold hover:bg-primary-container/10"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={onPublish}
                        className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-md hover:opacity-90"
                    >
                        Publish Now
                    </button>


                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-container-high rounded-full"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>

                </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Image Upload */}
                <div className="relative cursor-pointer h-64 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center hover:bg-surface-container-high">
                    <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 text-primary">
                        <span className="material-symbols-outlined text-4xl">
                            add_photo_alternate
                        </span>

                    </div>

                    <p className="font-bold">
                        Upload Featured Image
                    </p>

                    <p className="text-sm text-on-surface-variant mt-1">
                        Recommended size: 1200x630px (Max 5MB)
                    </p>
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                {/* Main Fields */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-primary uppercase">
                                Article Title
                            </label>

                            <input
                                value={form.title}
                                onChange={(e) =>
                                    updateField(
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter a captivating title..."
                                className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0"
                            />

                        </div>
                        <div>
                            <label className="text-xs font-bold text-on-surface-variant uppercase">
                                Subtitle
                            </label>

                            <textarea
                                value={form.subtitle}
                                onChange={(e) =>
                                    updateField(
                                        "subtitle",
                                        e.target.value
                                    )
                                }
                                rows={2}
                                placeholder="Write a short summary..."
                                className="w-full text-xl bg-transparent border-none focus:ring-0 resize-none"
                            />
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="col-span-4 space-y-6">
                        {/* Category */}
                        <div className="bg-surface-container-low rounded-2xl p-6 space-y-4">

                            <label className="text-xs font-bold uppercase">
                                Category
                            </label>
                            <select
                                value={form.BlogCategory}
                                onChange={(e) =>
                                    updateField(
                                        "BlogCategory",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl px-4 py-3"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option>
                                    Conservation
                                </option>

                                <option>
                                    Renewable Energy
                                </option>

                                <option>
                                    Community Impact
                                </option>

                                <option>
                                    Eco-Innovation
                                </option>
                            </select>
                        </div>
                        {/* Tags */}
                        <div className="bg-surface-container-low rounded-2xl p-6 space-y-4">

                            <label className="text-xs font-bold uppercase">
                                Tags
                            </label>
                            {/*<div className="flex flex-wrap gap-2"
                                tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-primary-container/20 rounded-full flex items-center gap-2 text-sm"
                                    >
                                        {tag}
                                        <button
                                            onClick={() =>
                                                removeTag(tag)
                                            }
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        addTag();
                                    }
                                }
                                placeholder="Add tag"
                                className="px-3 py-1 rounded-full border"
                                
                            />*/}
                        </div>
                    </div>
                </div>
            </div>
            {/* Editor */}
            <div className="space-y-4">
                <div className="flex gap-2 pb-4 border-b">

                    {
                        [
                            "format_bold",
                            "format_italic",
                            "format_list_bulleted",
                            "format_quote",
                            "link",
                            "image",
                            "code",
                        ].map(icon => (

                            <button
                                key={icon}
                                className="p-2 hover:bg-surface-container-high rounded-lg"
                            >
                                <span className="material-symbols-outlined">
                                    {icon}
                                </span>
                            </button>
                        ))
                    }
                </div>
                <textarea
                    value={form.content}
                    onChange={(e) =>
                        updateField(
                            "content",
                            e.target.value
                        )
                    }
                    rows={12}
                    placeholder="Start writing your main content here..."
                    className="w-full text-lg bg-transparent border-none focus:ring-0 resize-none"
                />
            </div>
            {/* Footer */}
            <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center">
                <div className="flex gap-4 text-sm text-on-surface-variant">
                    <span>
                        🕒 Last saved at 14:05
                    </span>
                    <span>
                        📄 {form.content.split(/\s+/).filter(Boolean).length} words
                    </span>
                </div>
                <button className="flex items-center gap-2 hover:text-primary">
                    <span className="material-symbols-outlined">
                        visibility
                    </span>
                    Preview
                </button>
            </div>
        </div >
    );
}