"use client";

import AddRefillArticleModal from "@/components/modals/admin/refill/AddRefillArticleModal";
import AddRefillCategoryModal from "@/components/modals/admin/refill/AddRefillCategoryModal";
import DeleteRefillArticleModal from "@/components/modals/admin/refill/DeleteRefillArticleModal";
import { categoryService } from "@/services/categoryService";
import { refillService } from "@/services/refillService";
import { Category, RefillArticle } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function RefillStockPage() {

    const [articles, setArticles] = useState<RefillArticle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] =
        useState<string>("all");

    const [showAddArticleModal, setShowAddArticleModal] =
        useState(false);

    const [showAddCategoryModal, setShowAddCategoryModal] =
        useState(false);

    const [selectedArticle, setSelectedArticle] =
        useState<RefillArticle | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [articleToDelete, setArticleToDelete] =
        useState<RefillArticle | null>(null);

    const ITEMS_PER_PAGE = 3;

    const [currentPage, setCurrentPage] = useState(1);

    const [showFilters, setShowFilters] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [stockFilter, setStockFilter] =
        useState<
            "all" | "low" | "healthy"
        >("all");


    const [maxPrice, setMaxPrice] =
        useState(100);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
        try {
            setLoading(true);

            const [articlesData, categoriesData] =
                await Promise.all([
                    refillService.getRefillArticles(),
                    categoryService.getCategories(),
                ]);

            setArticles(articlesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredArticles = articles.filter(
        (article) => {
            const categoryMatch =
                selectedCategory === "all" ||
                article.category?._id ===
                selectedCategory;

            const searchMatch =
                article.nom
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const stockMatch =
                stockFilter === "all"
                    ? true
                    : stockFilter === "low"
                        ? article.stock < 3
                        : article.stock >= 3;

            const priceMatch =
                article.prix <= maxPrice;

            return (
                categoryMatch &&
                searchMatch &&
                stockMatch &&
                priceMatch
            );
        }
    );

    const hasFilters =
        selectedCategory !== "all" ||
        search !== "" ||
        stockFilter !== "all";

    const totalProducts = articles.length;

    const lowStockCount =
        articles.filter(
            (a) => a.stock < 5
        ).length;

    const inventoryValue =
        articles.reduce(
            (sum, a) =>
                sum + a.prix * a.stock,
            0
        );

    const totalCarbonOffset = articles.reduce(
        (sum, article) => sum + (article.CO2_refill || 0),
        0
    );

    const totalInventoryValue = useMemo(
        () =>
            articles.reduce(
                (sum, article) =>
                    sum +
                    Number(article.prix || 0) *
                    Number(article.stock || 0),
                0
            ),
        [articles]
    );

    const totalUnits = articles.reduce(
        (sum, p) => sum + Number(p.stock || 0),
        0
    );

    const totalPages = Math.ceil(
        filteredArticles.length / ITEMS_PER_PAGE
    );

    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredArticles.length]);

    const getVisiblePages = () => {
        const pages = [];

        for (
            let i = Math.max(1, currentPage - 1);
            i <= Math.min(totalPages, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }

        return pages;
    };

    const exportCSV = () => {
        const headers = [
            "Name",
            "Description",
            "Category",
            "Price",
            "Stock",
            "Points",
            "CO2 Saved",
        ];

        const rows = filteredArticles.map(
            (article) => [
                article.nom,
                article.description,
                article.category?.name,
                article.prix,
                article.stock,
                article.points,
                article.CO2_refill,
            ]
        );

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "refill-inventory.csv";

        link.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen">

            {/* Main */}
            <main className="flex-1 bg-surface">

                {/* Content */}
                <div className="p-2 space-y-10 max-w-12xl mx-auto">
                    {/* Page Header */}
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-5xl font-bold text-primary">
                                Refill Shop Stock
                            </h2>

                            <p className="text-lg text-on-surface-variant mt-2 max-w-xl">
                                Manage your circular economy inventory.
                                Monitor bulk distribution, carbon offsets,
                                and restocking thresholds across all
                                bio-categories.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={exportCSV}
                                className="px-6 py-3 rounded-full border border-outline-variant/30 text-secondary font-bold hover:bg-surface-container-low"
                            >
                                Export CSV
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        setShowAddCategoryModal(true)
                                    }
                                    className="px-6 py-3 rounded-full border text-white border-outline-variant/30 font-bold bg-secondary hover:bg-secondary/90 hover:text-black"
                                >
                                    Add Category
                                </button>

                                <button
                                    onClick={() =>
                                        setShowAddArticleModal(true)
                                    }
                                    className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg"
                                >
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() =>
                                setSelectedCategory("all")
                            }
                            className={`px-5 py-2 rounded-full font-bold transition-colors
                                ${selectedCategory === "all"
                                    ? "bg-primary-container text-on-primary-container"
                                    : "text-on-surface-variant hover:bg-surface-container-high"
                                }
                            `}
                        >
                            All Inventory
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() =>
                                    setSelectedCategory(category._id)
                                }
                                className={`px-5 py-2 rounded-full transition-colors
                                    ${selectedCategory === category._id
                                        ? "bg-primary-container text-on-primary-container font-bold"
                                        : "text-on-surface-variant hover:bg-surface-container-high"
                                    }
                                `}
                            >
                                {category.name}
                            </button>
                        ))}

                        <button
                            onClick={() =>
                                setShowFilters(true)
                            }
                            className="ml-auto flex items-center gap-2 text-primary font-bold"
                        >
                            <span className="material-symbols-outlined text-sm">
                                filter_list
                            </span>

                            Advanced Filters
                        </button>
                        {
                            showFilters && (
                                <div className="mt-4 rounded-3xl border bg-surface-container-lowest p-5">
                                    <h3 className="mb-4 text-lg font-bold">
                                        Advanced Filters
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        {/* Search */}
                                        <div>
                                            <label className="mb-2 block text-sm font-bold">
                                                Search Product
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Product name..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="w-full rounded-xl bg-surface-container-high p-3"
                                            />
                                        </div>

                                        {/* Stock */}
                                        <div>
                                            <label className="mb-2 block text-sm font-bold">
                                                Stock Status
                                            </label>

                                            <select
                                                value={stockFilter}
                                                onChange={(e) =>
                                                    setStockFilter(
                                                        e.target.value as
                                                        | "all"
                                                        | "low"
                                                        | "healthy"
                                                    )
                                                }
                                                className="w-full rounded-xl bg-surface-container-high p-3"
                                            >
                                                <option value="all">
                                                    All Stock
                                                </option>

                                                <option value="low">
                                                    Low Stock
                                                </option>

                                                <option value="healthy">
                                                    Healthy Stock
                                                </option>
                                            </select>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="mb-2 block text-sm font-bold">
                                                Max Price
                                            </label>

                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) =>
                                                    setMaxPrice(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full rounded-xl bg-surface-container-high p-3"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() =>
                                                setShowFilters(false)
                                            }
                                            className="rounded-xl bg-primary px-4 py-2 text-on-primary"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 bg-surface-container-low p-8 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="uppercase tracking-widest text-primary font-bold opacity-70">
                                    Total Carbon Offset
                                </p>

                                <h3 className="text-5xl font-bold mt-2">
                                    {(totalCarbonOffset * totalUnits).toLocaleString()}{" "}
                                    <span className="text-2xl text-on-surface-variant">
                                        kg CO2
                                    </span>
                                </h3>

                                <p className="text-on-surface-variant mt-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        inventory_2
                                    </span>

                                    {totalUnits.toLocaleString()} refill units currently in stock
                                </p>
                            </div>

                            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        </div>

                        <div className="bg-surface-container-lowest p-8 rounded-3xl border">
                            <p className="text-on-surface-variant">
                                Critical Stock
                            </p>

                            <h3 className="text-4xl font-bold text-error mt-1">
                                {lowStockCount} Items
                            </h3>

                            <div className="mt-4 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                <div className="bg-error h-full w-1/4"></div>
                            </div>

                            <p className="mt-3 text-on-surface-variant">
                                Requires immediate refill
                            </p>
                        </div>

                        <div className="bg-secondary p-8 rounded-3xl text-on-secondary shadow-lg">
                            <p className="opacity-80">
                                Current stock valuation
                            </p>

                            <h3 className="mt-1 text-4xl font-bold">
                                {totalInventoryValue.toLocaleString(
                                    "fr-TN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}{" "}
                                TND
                            </h3>

                            <p className="mt-3 opacity-80">
                                {totalUnits.toLocaleString()} products in inventory
                            </p>
                        </div>
                    </section>

                    {/* Table */}
                    <section className="bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-on-surface-variant uppercase text-sm">
                                        <th className="pb-4 pl-4">
                                            Product Details
                                        </th>

                                        <th className="pb-4">Pricing</th>
                                        <th className="pb-4">Stock Level</th>
                                        <th className="pb-4">Impact</th>
                                        <th className="pb-4">Product Description</th>
                                        <th className="pb-4 pr-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedArticles.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-16 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-5xl text-outline opacity-50">
                                                        inventory_2
                                                    </span>

                                                    <h3 className="text-lg font-bold">
                                                        {hasFilters
                                                            ? "No matching products"
                                                            : "No products yet"}
                                                    </h3>

                                                    <p className="max-w-md text-sm text-on-surface-variant">
                                                        {hasFilters
                                                            ? "Try changing your filters or search criteria."
                                                            : "Start by creating your first refill product."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedArticles.map((product) => (
                                            <tr
                                                key={product._id}
                                                className="group hover:bg-surface-container-low transition-colors"
                                            >
                                                <td className="py-4 pl-4 rounded-l-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container">
                                                            <Image
                                                                src={`${API_URL}${product.photo}`}
                                                                alt={product.nom}
                                                                width={64}
                                                                height={64}
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-bold text-lg">
                                                                {product.nom}
                                                            </p>

                                                            <p className="text-sm text-on-surface-variant">
                                                                {product.category.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4">
                                                    <p className="font-bold text-primary">
                                                        {product.prix} TND/L
                                                    </p>
                                                </td>

                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 max-w-[100px] h-2 bg-surface-container-high rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-primary h-full"
                                                                style={{
                                                                    width: product.stock,
                                                                }}
                                                            />
                                                        </div>

                                                        <p className="text-sm font-bold">
                                                            {product.stock}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <span className="material-symbols-outlined text-sm fill">
                                                            eco
                                                        </span>

                                                        <p className="text-sm font-bold">
                                                            {product.CO2_refill}Kg  CO2
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="py-4">
                                                    <code className="text-sm bg-surface-container px-2 py-1 rounded">
                                                        {product.description}
                                                    </code>
                                                </td>

                                                <td className="py-4 pr-4 rounded-r-2xl text-right">
                                                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedArticle(product);
                                                                setShowAddArticleModal(true);
                                                            }}

                                                            className="p-2 hover:bg-surface-container-highest rounded-full text-secondary"
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                edit_square
                                                            </span>
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setArticleToDelete(product);
                                                                setDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-error-container hover:text-error rounded-full"
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 flex items-center justify-between border-t mt-4">
                            <p className="text-sm text-on-surface-variant">
                                Showing{" "}
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                {" - "}
                                {Math.min(
                                    currentPage * ITEMS_PER_PAGE,
                                    filteredArticles.length
                                )}{" "}
                                of {filteredArticles.length} products
                            </p>

                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_left
                                    </span>
                                </button>

                                {getVisiblePages()
                                    .map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-xl font-bold transition-colors
                                                ${currentPage === page
                                                    ? "bg-primary text-on-primary"
                                                    : "border hover:bg-surface-container-high"
                                                }
                                        `}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <AddRefillCategoryModal
                    open={showAddCategoryModal}
                    onClose={() =>
                        setShowAddCategoryModal(false)
                    }
                    onSuccess={fetchData}
                />

                <AddRefillArticleModal
                    open={showAddArticleModal}
                    article={selectedArticle}
                    categories={categories}
                    onClose={() => {
                        setShowAddArticleModal(false);
                        setSelectedArticle(null);
                    }}
                    onSuccess={fetchData}
                />

                <DeleteRefillArticleModal
                    open={deleteModalOpen}
                    article={articleToDelete}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setArticleToDelete(null);
                    }}
                    onSuccess={fetchData}
                />

                {/*<EditRefillArticleModal
                    article={selectedArticle}
                    categories={categories}
                    onClose={() =>
                        setSelectedArticle(null)
                    }
                    onSuccess={fetchData}
                />*/}

                {/* Mobile FAB */}
                <button className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </button>
            </main>

            {/* Desktop FAB 
            <div className="fixed bottom-10 right-10 hidden md:flex">
                <button className="group flex items-center gap-3 bg-secondary text-on-secondary px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all">
                    <span className="material-symbols-outlined fill">
                        barcode_scanner
                    </span>

                    <span className="font-bold">
                        Scan Shipment
                    </span>
                </button>
            </div>
            */}
        </div>
    );
}