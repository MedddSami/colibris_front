'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useEffect, useMemo, useState } from 'react';
import { RefillArticle } from '@/types/api';
import { refillService } from '@/services/refillService';
import Link from "next/link";
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';
import { packService } from '@/services/packService';
import { cartService } from '@/services/CartService';

export default function RefillShopPage() {
  const [refillArticles, setRefillArticles] = useState<RefillArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState("1L");
  const [selectedVolumes, setSelectedVolumes] = useState<Record<string, string>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { toast } = useToast();

  const PRODUCTS_PER_PAGE = 6;

  const volumes = ["1L", "2L", "5L"];

  async function fetchRefillArticles() {
    try {
      setLoading(true);

      const data = await refillService.getRefillArticles();

      setRefillArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRefillArticles();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        refillArticles.map((article) => article.category.name)
      )
    );
  }, [refillArticles]);

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const filteredProducts = refillArticles.filter((product) => {

    if (
      !product.nom.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category.name)
    ) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const getVolumeNumber = (volume?: string) => {
    if (!volume) return 1;

    return Number(volume.replace("L", ""));
  };

  const totalCO2Saved = refillArticles.reduce(
    (total, product) =>
      (total + product.CO2_refill) * product.stock,
    0
  );

  const handleAddToCart = async (product: RefillArticle) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description:
          "Please log in to add products to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {

      // Check shop access
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

      const volume =
        selectedVolumes[product._id] ||
        product.volume ||
        "1L";

      const volumeNumber =
        getVolumeNumber(volume);

      const price =
        product.prix * volumeNumber;

      const cartPayload = {
        articleId: product._id,
        quantity: volumeNumber,
        volume,
        price,
      };

      await cartService.addToRefillCart(
        cartPayload
      );

      toast({
        title: "Added to refill cart",
        description:
          `${product.nom} (${volume}) added successfully.`,
      });

    } catch (error: any) {
      console.error(
        "Add refill cart error:",
        error
      );

      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Could not add this refill product to your cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-24 pb-12 bg-background">
        {/* Hero Section */}
        <section className="mb-12 relative rounded-[2.5rem] overflow-hidden bg-primary min-h-[320px] flex flex-col justify-center px-10 md:px-16 text-primary-foreground">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              alt="Hero texture"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUwAwDbVVPq-62e2EQUgWn0mK3m91WWA2ztLbTZOIn7pmcgJ6bXwP1KXpDe-WXeL4t3pDVo9V3lOetaeW_78LnNlWDb5kzDwnONAQZMAKMc8o2hjRZIHoAsCfKESpaaNHAQvEHBMap3wnksg9csm_974QGj2tDmeyMur86_xCJqPmIBbDu8P5MA_XSYchw6xveJupRKYRhLuhslxRvArZ6qE-cx2DtR4g_7BSI_Yd-sISjSkGo4aQpOabvoPHdNIKE41h1fkrSQXLR"
            />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/30 backdrop-blur-md text-white/60 font-bold text-xs uppercase tracking-widest mb-6">Sustainable Selection</span>
            <h1 className="text-5xl md:text-6xl text-white/80 font-bold tracking-tight mb-4 leading-tight">Our Refill Shop.</h1>
            <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              Curated essentials without the waste. Precision-poured ingredients for your home and health.
            </p>
          </div>
        </section>

        {/* Filters & Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
              <input
                type="text"
                placeholder="Search refill products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
              <h2 className="text-2xl font-bold text-foreground">Browse Categories</h2>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap ${selectedCategories.includes(category)
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-container-lowest hover:bg-primary/10"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {/*<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['shower', 'local_laundry_service', 'skillet', 'cleaning_services'].map((icon, i) => {
                const labels = ['Shower Gel', 'Laundry', 'Cooking Oils', 'Cleaners']
                return (
                  <div key={i} className="aspect-square bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all group cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-tight text-on-surface-variant">{labels[i]}</span>
                  </div>
                )
              })}
            </div>*/}
          </div>
          <div className="md:col-span-4 bg-primary text-on-primary rounded-[2rem] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Refill Impact</h3>
              <p className="text-on-primary/70 text-sm">Every refill product prevents on average 1.4 kg of CO2 from reaching the atmosphere.</p>
            </div>
            <div className="mt-8">
              <div className="text-5xl font-extrabold tracking-tighter mb-1">
                {totalCO2Saved.toFixed(0)} Kg
              </div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                CO₂ Saved
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="flex -space-x-3">
                {[1, 2].map((i) => (
                  <img
                    key={i}
                    alt={`Avatar ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                    src="https://via.placeholder.com/32x32"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center text-xs font-bold">+82</div>
              </div>
              <span className="text-xs font-medium self-center">Joined the movement</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {paginatedProducts.map((product, i) => (

            <div key={i} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <Link
                key={product._id}
                href={`/product/${product._id}?type=refill`}
                className="block"
              >
                <div className="h-72 overflow-hidden relative">
                  <img
                    alt={product.nom}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={`${API_URL}${product.photo}`}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-tighter">Refill 🌱</span>
                  </div>
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-primary hover:bg-primary hover:text-white transition-all active:scale-90">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </Link>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">{product.nom}</h3>
                    <p className="text-sm text-on-surface-variant font-medium">{product.description}</p>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-800">{
                    (
                      product.prix *
                      getVolumeNumber(
                        selectedVolumes[product._id] || product.volume
                      )
                    ).toFixed(2)
                  }TND</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3">Select Volume</p>
                    <div className="flex gap-2">
                      {volumes.map((vol) => {

                        const activeVolume =
                          selectedVolumes[product._id] || product.volume || "1L";

                        return (

                          <button
                            key={vol}
                            onClick={() =>
                              setSelectedVolumes((prev) => ({
                                ...prev,
                                [product._id]: vol
                              }))
                            }
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeVolume === vol
                              ? "bg-primary-container/20 text-on-primary-container border-2 border-primary-container"
                              : "border border-outline-variant/30 hover:border-primary-container hover:bg-primary-container/5"
                              }`}
                          >
                            {vol}

                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-container text-on-primary-container font-extrabold py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary-container/20 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">
                      shopping_bag
                    </span>

                    Add to Refill Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main >
      <Footer />
    </>
  )
}
