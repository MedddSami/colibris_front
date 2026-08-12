"use client";

import { useEffect, useState } from "react";

import { refillService } from "@/services/refillService";

import { Category, RefillArticle } from "@/types/api";
interface Props {
    open: boolean;
    categories: Category[];
    article?: RefillArticle | null;
    onClose: () => void;
    onSuccess: () => void;
}

const initialForm = {
    nom: "",
    description: "",
    stock: 0,
    prix: 0,
    points: 0,
    CO2_refill: 0,
    category: "",
};

export default function AddRefillArticleModal({
    open,
    categories,
    article,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState(initialForm);

    const isEditing = !!article;

    useEffect(() => {
        if (!open) return;

        if (!article) {
            setForm(initialForm);
            setImage(null);
            return;
        }

        setForm({
            nom: article.nom ?? "",
            description: article.description ?? "",
            stock: article.stock ?? 0,
            prix: article.prix ?? 0,
            points: article.points ?? 0,
            CO2_refill: article.CO2_refill ?? 0,
            category:
                typeof article.category === "string"
                    ? article.category
                    : article.category?._id ?? "",
        });

        setImage(null);
    }, [article, open]);

    const buildFormData = () => {
        const formData = new FormData();

        formData.append("nom", form.nom);
        formData.append("description", form.description);
        formData.append("stock", String(form.stock));
        formData.append("prix", String(form.prix));
        formData.append("points", String(form.points));
        formData.append(
            "CO2_refill",
            String(form.CO2_refill)
        );
        formData.append("category", form.category);

        if (image) {
            formData.append("photo", image);
        }

        return formData;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const formData = buildFormData();

            console.group(
                isEditing
                    ? "Update Refill Article"
                    : "Create Refill Article"
            );


            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            console.groupEnd();

            if (isEditing && article) {
                await refillService.updateRefillArticle(
                    article._id,
                    formData
                );
            } else {
                await refillService.createRefillArticle(
                    formData
                );
            }

            setForm(initialForm);
            setImage(null);

            onSuccess();
            onClose();
        } catch (err: any) {
            console.group("Refill Article Error");

            console.error(err);
            console.error(
                "Status:",
                err?.response?.status
            );
            console.error(
                "Response:",
                err?.response?.data
            );

            console.groupEnd();

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl bg-surface-container-low p-6">
                <h2 className="text-xl font-bold">
                    {article
                        ? "Edit Product"
                        : "Add Product"}
                </h2>

                <p>
                    {article
                        ? "Update refill article details"
                        : "Add new refill article in the refill inventory"}
                </p>

                <div className="mt-4 grid gap-5">

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-label-md font-bold">
                            Product Name
                        </label>

                        <input
                            placeholder="Organic Bergamot Hand Wash"
                            className="w-full rounded-xl bg-surface-container-high p-3"
                            value={form.nom}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nom: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-label-md font-bold">
                            Description
                        </label>

                        <textarea
                            rows={2}
                            placeholder="Product description..."
                            className="w-full rounded-xl bg-surface-container-high p-2"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="mb-2 block text-label-md font-bold">
                                Price (TND)
                            </label>

                            <input
                                type="number"
                                className="w-full rounded-xl bg-surface-container-high p-3"
                                value={form.prix}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        prix: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-label-md font-bold">
                                Stock in Liters
                            </label>

                            <input
                                type="number"
                                className="w-full rounded-xl bg-surface-container-high p-3"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stock: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                    </div>

                    {/* Points & CO2 */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="mb-2 block text-label-md font-bold">
                                Reward Points
                            </label>

                            <input
                                type="number"
                                className="w-full rounded-xl bg-surface-container-high p-3"
                                value={form.points}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        points: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-label-md font-bold">
                                CO₂ Saved per product (Kg)
                            </label>

                            <input
                                type="number"
                                className="w-full rounded-xl bg-surface-container-high p-3"
                                value={form.CO2_refill}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        CO2_refill: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                        </div>

                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-label-md font-bold">
                            Category
                        </label>

                        <select
                            className="w-full rounded-xl bg-surface-container-high p-3"
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-label-md font-bold">
                            Product Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />
                    </div>

                </div>
                {
                    error && (
                        <div className="rounded-xl border border-error/20 bg-error-container p-3 text-sm text-error">
                            {error}
                        </div>
                    )
                }

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="rounded-xl bg-primary px-4 py-2 text-on-primary"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}