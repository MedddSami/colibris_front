'use client'

import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Article } from '@/types/api'
import { shopService } from '@/services/shopService'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import { useToast } from '@/hooks/use-toast'
import { packService } from '@/services/packService'
import { refillService } from '@/services/refillService'
import { cartService } from '@/services/CartService'


export default function ShopPage() {
  const router = useRouter()
  const [activeType, setActiveType] = useState<'all' | 'new' | 'refill'>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowCarbonOnly, setLowCarbonOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxCO2Filter, setMaxCO2Filter] = useState(0);

  const PRODUCTS_PER_PAGE = 6;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { toast } = useToast();

  async function fetchProducts() {
    try {
      setLoading(true);

      const [articlesData] = await Promise.all([
        shopService.getArticles(),
      ]);

      setArticles(articlesData);

    } catch (error) {
      console.error("Failed loading products", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      const highestPrice = Math.max(
        ...articles.map((p) => p.prix)
      );
      setMaxCO2Filter(
        Math.max(
          ...articles.map((p) => p.CO2 ?? 0)
        )
      );

      setMaxPrice(highestPrice);
    }
  }, [articles]);



  const categories = useMemo(() => {
    return Array.from(
      new Set(
        articles.map((article) => article.category.name)
      )
    );
  }, [articles]);

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);


  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategories,
    maxPrice,
    maxCO2Filter
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const maxProductPrice = Math.max(
    ...articles.map((p) => p.prix),
    0
  );

  const maxCO2 = Math.max(
    ...articles.map((p) => p.CO2 ?? 0),
    0
  );

  const filteredProducts = articles.filter((product) => {

    // Search
    if (
      !product.nom
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    // Categories
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category.name)
    ) {
      return false;
    }

    // Price
    if (product.prix > maxPrice) {
      return false;
    }

    // CO₂
    if (
      lowCarbonOnly &&
      product.CO2 > 10
    ) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleAddToCart = async (product: Article) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add products to your cart.",
        variant: "destructive",
      });

      return;
    }

    if (!product) return;

    try {

      // Check shop access first
      const access =
        await packService.checkAccess();


      if (!access.canAccessShop) {

        toast({
          title: "Shop access required",
          description:
            "You need an active pack or a reservation for a recent collection to access the shop.",
          variant: "destructive",
        });

        return;
      }

      const cartPayload = {
        articleId: product._id,
        quantity: 1,
      };

      await cartService.addToCart(cartPayload);

      toast({
        title: "Added to cart",
        description:
          `${product.nom} added successfully.`,
      });

    } catch (error: any) {

      console.error(
        "Add cart error:",
        error
      );

      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Could not add this product to your cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 bg-surface">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[3.5rem] font-bold tracking-tight text-on-surface leading-tight mb-4">The Circular Shop</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">Curated sustainable goods designed for longevity. Every
            purchase supports our mission toward a biophilic future.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            {/* Type Filter */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Search
              </h3>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-low pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </section>

            {/* Categories */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Categories
              </h3>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-sm border-2 transition-all flex items-center justify-center ${selectedCategories.includes(category)
                        ? 'bg-primary border-primary'
                        : 'border-outline-variant group-hover:border-primary/50'
                        }`}>
                        {selectedCategories.includes(category) && (
                          <span className="material-symbols-outlined text-on-primary text-sm font-bold">check</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="hidden"
                      />
                      <span className={`text-body-lg font-medium transition-colors ${selectedCategories.includes(category) ? 'text-primary' : 'text-on-surface/70'}`}>
                        {category}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {/* Price Range */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral/60 mb-4">
                Price Range
              </h3>

              <input
                type="range"
                min={0}
                max={maxProductPrice}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />

              <p className="text-xs text-neutral/60 mt-2">
                0 TND - {maxPrice} TND
              </p>
            </section>

            {/* Impact Filter */}
            <section className="bg-primary-container/10 p-6 rounded-xl">

              <div className="flex items-center gap-2 text-primary mb-4">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>

                <span className="font-bold text-sm">
                  Maximum CO₂ Offset
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={maxCO2}
                value={maxCO2Filter}
                onChange={(e) =>
                  setMaxCO2Filter(Number(e.target.value))
                }
                className="w-full accent-primary"
              />

              <p className="text-xs text-on-surface-variant mt-2">
                Up to {maxCO2Filter} kg CO₂
              </p>

            </section>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-8 text-on-surface/40 text-label-md font-bold uppercase tracking-widest">
              Showing {paginatedProducts.length} products
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {paginatedProducts.map((product) => (
                <Card
                  key={product._id}
                  className="cursor-pointer group bg-surface-container-low rounded-lg shadow-sm hover:shadow-md transition-shadow"

                >
                  <div className="block group crusor-pointer">
                    <div className="aspect-[4/5] bg-surface-container rounded-md overflow-hidden mb-6 relative">

                      <img
                        alt={product.nom}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={`${API_URL}${product.photo}`}
                        onClick={() =>
                          router.push(`/product/${product._id}?type=article`)
                        }
                      />

                      {/*{product.type === 'refill' && (
                        <span className="absolute top-4 left-4 bg-surface-container backdrop-blur-md text-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <span className="material-symbols-outlined text-[10px]">
                            eco
                          </span>
                          Refill
                        </span>
                      )}

                      {product.type === 'new' && (
                        <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <span className="material-symbols-outlined text-[10px]">
                            auto_awesome
                          </span>
                          New
                        </span>
                      )}*/}

                    </div>

                    <div className="text-center">

                      <p className="text-label-md uppercase tracking-widest text-on-surface/40 mb-3 font-bold">
                        {product.category.name}
                      </p>

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-on-surface group-hover:text-primary transition-colors">
                          {product.nom}
                        </h3>

                        <span className="text-lg font-medium text-secondary">
                          {product.prix} TND
                        </span>
                      </div>

                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                        {product.description}
                      </p>

                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-4 bg-primary text-on-primary rounded-md font-bold transition-all hover:bg-primary-container active:scale-95 shadow-[0px_12px_32px_rgba(0,108,74,0.1)]"
                  >
                    Add to Cart
                  </button>
                </Card>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center gap-4">

              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">
                  chevron_left
                </span>
              </button>

              <span className="text-sm font-bold text-primary">
                {String(currentPage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </button>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
