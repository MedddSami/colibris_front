"use client";

import { useEffect, useState } from "react";

import { shopService } from "@/services/shopService";
import { Article, Category } from "@/types/api";

interface Props {
    open: boolean;
    categories: Category[];
    article?: Article | null;
    onClose: () => void;
    onSuccess: () => void;
}

const initialForm = {
    nom: "",
    type: "",
    description: "",
    quantite: 0,
    prix: 0,
    points: 0,
    plateforme: "",
    code: "",
    stock: 0,
    CO2: 0,
    category: "",
};

export default function AddShopArticleModal({
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
            type: article.type ?? "",
            description: article.description ?? "",
            quantite: article.quantite ?? 0,
            prix: article.prix ?? 0,
            points: article.points ?? 0,
            plateforme: article.plateforme ?? "",
            code: article.code ?? "",
            stock: article.stock ?? 0,
            CO2: article.CO2 ?? 0,
            category:
                typeof article.category === "string"
                    ? article.category
                    : article.category?._id ?? "",
        });

        setImage(null);
    }, [article, open]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            if (isEditing && article) {
                await shopService.updateArticle(
                    article._id,
                    form
                );
            } else {
                const formData = new FormData();

                Object.entries(form).forEach(
                    ([key, value]) => {
                        formData.append(
                            key,
                            String(value)
                        );
                    }
                );

                if (image) {
                    formData.append("photo", image);
                }

                await shopService.createArticle(
                    formData
                );
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-low p-6">

                <h2 className="text-xl font-bold">
                    {isEditing
                        ? "Edit Product"
                        : "Add Product"}
                </h2>
                <p>
                    Manage your shop inventory all in one place
                </p>

                <div className="mt-6 grid gap-4">
                    <label className="text-label-md font-bold text-on-surface">
                        Name
                    </label>
                    <input
                        placeholder="Product Name"
                        className="rounded-xl bg-surface-container-high p-3"
                        value={form.nom}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                nom: e.target.value,
                            })
                        }
                    />
                    <label className="text-label-md font-bold text-on-surface">
                        Description
                    </label>
                    <textarea
                        placeholder="Description"
                        rows={3}
                        className="rounded-xl bg-surface-container-high p-3"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description:
                                    e.target.value,
                            })
                        }
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <label className="text-label-md font-bold text-on-surface">
                            Type
                        </label>

                        <select
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.type}
                            onChange={(e) => {
                                const type = e.target.value;

                                setForm({
                                    ...form,
                                    type,
                                    ...(type === "product"
                                        ? {
                                            plateforme: "",
                                            code: "",
                                        }
                                        : {}),
                                });
                            }}
                        >
                            <option value="">Select Type</option>
                            <option value="product">Product</option>
                            <option value="code">Reduction Code</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/*
                        <label className="text-label-md font-bold text-on-surface">
                            Quantity
                        </label>
                        <input
                            placeholder="Quantity"
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.quantite}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    quantite:
                                        e.target.value,
                                })
                            }
                        />*/}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <label className="text-label-md font-bold text-on-surface">
                            Price (TND)
                        </label>
                        <input
                            type="number"
                            placeholder="Price"
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.prix}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    prix: Number(
                                        e.target.value
                                    ),
                                })
                            }
                        />

                        <label className="text-label-md font-bold text-on-surface">
                            Stock
                        </label>
                        <input
                            type="number"
                            placeholder="Stock"
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.stock}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stock: Number(
                                        e.target.value
                                    ),
                                })
                            }
                        />

                        <label className="text-label-md font-bold text-on-surface">
                            Reward Points
                        </label>
                        <input
                            type="number"
                            placeholder="Points"
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.points}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    points: Number(
                                        e.target.value
                                    ),
                                })
                            }
                        />
                        <label className="text-label-md font-bold text-on-surface">
                            CO2 Saved (Kg)
                        </label>
                        <input
                            type="number"
                            placeholder="CO₂"
                            className="rounded-xl bg-surface-container-high p-3"
                            value={form.CO2}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    CO2: Number(
                                        e.target.value
                                    ),
                                })
                            }
                        />
                    </div>
                    <label className="text-label-md font-bold text-on-surface">
                        Category
                    </label>

                    <select
                        className="rounded-xl bg-surface-container-high p-3"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category:
                                    e.target.value,
                            })
                        }
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label className="text-label-md font-bold text-on-surface">
                        Image
                    </label>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(
                                e.target
                                    .files?.[0] ??
                                null
                            )
                        }
                    />


                    {form.type === "code" && (
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-label-md font-bold text-on-surface">
                                Platform
                            </label>

                            <label className="text-label-md font-bold text-on-surface">
                                Code
                            </label>

                            <input
                                placeholder="Platform"
                                className="rounded-xl bg-surface-container-high p-3"
                                value={form.plateforme}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        plateforme: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Code"
                                className="rounded-xl bg-surface-container-high p-3"
                                value={form.code}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        code: e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl bg-error-container p-3 text-error">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-xl bg-primary text-on-primary"
                    >
                        {loading
                            ? "Saving..."
                            : isEditing
                                ? "Update"
                                : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
}