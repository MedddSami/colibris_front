"use client"
import AddRefillCategoryModal from "@/components/modals/admin/refill/AddRefillCategoryModal";
import AddShopArticleModal from "@/components/modals/admin/shop/AddShopArticleModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { categoryService } from "@/services/categoryService";
import { shopService } from "@/services/shopService";
import { Article, Category } from "@/types/api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


export default function ShopStockPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] =
        useState<string>("all");

    const [showAddArticleModal, setShowAddArticleModal] =
        useState(false);

    const [showAddCategoryModal, setShowAddCategoryModal] =
        useState(false);

    const [selectedArticle, setSelectedArticle] =
        useState<Article | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [articleToDelete, setArticleToDelete] =
        useState<Article | null>(null);

    const [showArticleModal, setShowArticleModal] =
        useState(false);

    const [stockFilter, setStockFilter] = useState<
        "all" | "high" | "medium" | "low" | "out"
    >("all");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    const fetchData = async () => {
        try {
            setLoading(true);

            const [articlesData, categoriesData] =
                await Promise.all([
                    shopService.getArticles(),
                    categoryService.getCategories(),
                ]);

            setArticles(articlesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error(
                "Failed loading shop inventory:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalProducts = articles.length;

    const totalUnits = articles.reduce(
        (sum, article) => sum + article.stock,
        0
    );

    const totalImpcat = articles.reduce(
        (sum, article) => sum + article.CO2,
        0
    );

    const getStockLevel = (stock: number) => {
        if (stock === 0) return "out";
        if (stock <= 10) return "low";
        if (stock <= 50) return "medium";
        return "high";
    };

    const filteredArticles = articles.filter((article) => {
        const matchesCategory =
            selectedCategory === "all" ||
            article.category?._id === selectedCategory;

        const matchesStock =
            stockFilter === "all" ||
            getStockLevel(article.stock) === stockFilter;

        return matchesCategory && matchesStock;
    });


    const handleDeleteArticle = async () => {
        if (!articleToDelete) return;

        try {
            await shopService.deleteArticle(
                articleToDelete._id
            );

            fetchData();

            setDeleteModalOpen(false);
            setArticleToDelete(null);
        } catch (error) {
            console.error(
                "Delete article failed:",
                error
            );
        }
    };

    const exportToCSV = () => {
        const headers = [
            "Name",
            "Category",
            "Price",
            "Stock",
            "Points",
            "CO2",
        ];

        const rows = articles.map((article) => [
            article.nom,
            article.category?.name,
            article.prix,
            article.stock,
            article.points,
            article.CO2,
        ]);

        const csv = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csv], {
            type: "text/csv",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "shop_inventory.csv";

        link.click();

        URL.revokeObjectURL(url);
    };

    const lowStockArticles = articles.filter(
        (article) => article.stock <= 10
    );

    const inventoryRef = useRef<HTMLDivElement>(null);


    return (
        <div className="bg-surface text-on-surface min-h-screen">

            {/* Main Content */}
            <main className="w-full">

                {/* Content */}
                <div className="p-10 space-y-12">

                    {/* Hero */}
                    <section className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-2">
                            <span className="text-secondary font-bold tracking-widest text-sm">
                                INVENTORY MANAGEMENT
                            </span>

                            <h1 className="text-6xl font-bold tracking-tight">
                                Eco Shop Stock
                            </h1>

                            <p className="text-lg text-on-surface-variant max-w-2xl">
                                Manage unit-based sustainable products,
                                reusable gear, and ethical kits within
                                the Colibris ecosystem.
                            </p>
                        </div>

                        <button className="flex items-center gap-3 bg-primary text-on-primary px-8 py-5 rounded-full font-bold shadow-lg"
                            onClick={() => {
                                setSelectedArticle(null);
                                setShowArticleModal(true);
                            }}>
                            <span className="material-symbols-outlined">
                                add_circle
                            </span>

                            Add New Product
                        </button>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col gap-4">
                            <span className="text-on-surface-variant font-medium">
                                TOTAL PRODUCTS
                            </span>

                            <span className="text-4xl font-bold text-primary">
                                {totalProducts}
                            </span>

                            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-3/4" />
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col gap-4">
                            <span className="text-on-surface-variant font-medium">
                                TOTAL UNITS
                            </span>

                            <span className="text-4xl font-bold text-secondary">
                                {totalUnits}
                            </span>

                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <span className="material-symbols-outlined text-sm">
                                    inventory_2
                                </span>

                                {totalProducts > 0
                                    ? `${Math.round(totalUnits / totalProducts)} units per product on average`
                                    : "No inventory"}
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-primary-container/10 p-8 rounded-xl border border-primary/10 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-primary font-bold text-sm">
                                        CO2 IMPACT TRACKER
                                    </span>

                                    <h3 className="text-3xl font-bold">
                                        {totalImpcat} Kg CO2 Offset
                                    </h3>
                                </div>

                                <span className="material-symbols-outlined text-primary text-4xl fill">
                                    eco
                                </span>
                            </div>

                            <p className="text-on-primary-container/80 text-lg">
                                Our eco-friendly products currently contribute to a potential average of{" "}
                                {(totalImpcat / totalProducts).toLocaleString()} kg CO₂ offset.
                            </p>
                        </div>
                    </section>

                    {/* Inventory */}
                    <section className="space-y-8" ref={inventoryRef}>

                        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                            <h2 className="text-3xl font-bold">
                                Current Inventory
                            </h2>

                            <div className="flex gap-4">
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() =>
                                            setSelectedCategory("all")
                                        }
                                        className={`px-4 py-2 rounded-full ${selectedCategory === "all"
                                            ? "bg-primary text-white"
                                            : "bg-surface-container-high"
                                            }`}
                                    >
                                        All Categories
                                    </button>

                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            onClick={() =>
                                                setSelectedCategory(
                                                    category._id
                                                )
                                            }
                                            className={`px-4 py-2 rounded-full ${selectedCategory === category._id
                                                ? "bg-primary text-white"
                                                : "bg-surface-container-high"
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high">
                                    <span className="material-symbols-outlined text-sm">
                                        sort
                                    </span>

                                    <select
                                        value={stockFilter}
                                        onChange={(e) =>
                                            setStockFilter(
                                                e.target.value as
                                                | "all"
                                                | "high"
                                                | "medium"
                                                | "low"
                                                | "out"
                                            )
                                        }
                                        className="bg-transparent outline-none"
                                    >
                                        <option value="all">All Stock</option>
                                        <option value="high">High Stock</option>
                                        <option value="medium">Medium Stock</option>
                                        <option value="low">Low Stock</option>
                                        <option value="out">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {filteredArticles.length === 0 ? (
                                <div className="bg-surface-container-lowest p-10 rounded-xl text-center">
                                    <h3 className="text-xl font-bold">
                                        No Products Found
                                    </h3>

                                    <p className="text-on-surface-variant mt-2">
                                        There are currently no products
                                        in this category.
                                    </p>
                                </div>
                            ) : (
                                filteredArticles.map((product) => (
                                    <div
                                        key={product._id}
                                        className={`bg-surface-container-lowest p-6 rounded-xl flex flex-col lg:flex-row gap-8 shadow-sm border-l-4 ${product.border} group hover:shadow-lg transition-all`}
                                    >
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={`${API_URL}${product.photo}`}
                                                alt={product.nom}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${product.tagClass}`}
                                                >
                                                    {product.category.name}
                                                </span>

                                                <h4 className="font-bold text-2xl">
                                                    {product.nom}
                                                </h4>

                                                <p className="text-sm text-outline">
                                                    Code: {product.code}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-sm text-on-surface-variant font-medium">
                                                    Stock Quantity
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <span className={`text-3xl font-bold ${product.statusColor}`}>
                                                        {product.stock} Units
                                                    </span>

                                                    <span className={`material-symbols-outlined text-sm ${product.statusColor}`}>
                                                        {product.statusIcon}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-sm text-on-surface-variant font-medium">
                                                    Pricing & Impact
                                                </span>

                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold">
                                                        {product.prix} TND
                                                    </span>

                                                    <span className="text-tertiary font-bold text-sm">
                                                        {product.CO2} Kg CO2 saved
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-3 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedArticle(product);
                                                        setShowArticleModal(true);
                                                    }}
                                                    className="p-3 bg-surface-container-high rounded-full hover:bg-secondary-container"
                                                >
                                                    <span className="material-symbols-outlined">
                                                        edit
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setArticleToDelete(product);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-3 bg-surface-container-high rounded-full hover:bg-error-container"
                                                >
                                                    <span className="material-symbols-outlined">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-surface-container p-8 rounded-xl space-y-4">
                            <span className="material-symbols-outlined text-primary text-4xl">
                                download
                            </span>

                            <h3 className="text-2xl font-bold">
                                Export Inventory
                            </h3>

                            <p className="text-lg text-on-surface-variant">
                                Download your complete inventory as a CSV file for reporting,
                                backups, or external analysis.
                            </p>

                            <button
                                onClick={exportToCSV}
                                className="text-primary font-bold flex items-center gap-2"
                            >
                                Export CSV

                                <span className="material-symbols-outlined text-sm">
                                    arrow_forward
                                </span>
                            </button>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl bg-secondary/10 border border-secondary/20 p-8 md:col-span-2">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

                                <div className="max-w-lg space-y-5">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary">
                                            Inventory Insights
                                        </p>

                                        <h3 className="mt-2 text-4xl font-bold">
                                            Low Stock Overview
                                        </h3>
                                    </div>

                                    <p className="text-lg text-on-surface-variant leading-relaxed">
                                        {lowStockArticles.length === 0
                                            ? "Excellent! Every product currently has a healthy inventory level."
                                            : `${lowStockArticles.length} product${lowStockArticles.length > 1 ? "s" : ""
                                            } ${lowStockArticles.length > 1 ? "are" : "is"
                                            } running low and should be restocked soon.`}
                                    </p>

                                    <button
                                        onClick={() => {
                                            setStockFilter("low");

                                            inventoryRef.current?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            });
                                        }}
                                        className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-on-secondary transition hover:scale-[1.02]"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            inventory_2
                                        </span>

                                        View Low Stock Products
                                    </button>
                                </div>

                                <div className="relative z-10 flex items-center justify-center">
                                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-secondary/15">
                                        <span className="material-symbols-outlined fill text-[240px] text-secondary">
                                            eco
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Decorative background icon */}
                            <span className="material-symbols-outlined fill absolute -right-10 -bottom-10 text-[240px] text-secondary/10 pointer-events-none">
                                eco
                            </span>
                        </div>
                    </section>
                </div>
                {/*
                <AddRefillCategoryModal
                    open={showAddCategoryModal}
                    onClose={() =>
                        setShowAddCategoryModal(false)
                    }
                    onSuccess={fetchData}
                />
                */}

                <AddShopArticleModal
                    open={showArticleModal}
                    article={selectedArticle}
                    categories={categories}
                    onClose={() => {
                        setShowArticleModal(false);
                        setSelectedArticle(null);
                    }}
                    onSuccess={fetchData}
                />

                <DeleteConfirmationModal
                    open={deleteModalOpen}
                    title="Delete Product"
                    message={`Delete "${articleToDelete?.nom}"?`}
                    onClose={() =>
                        setDeleteModalOpen(false)
                    }
                    onConfirm={handleDeleteArticle}
                />

            </main>
        </div>
    );
}