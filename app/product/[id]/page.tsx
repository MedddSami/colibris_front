'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react';
import { Article, RefillArticle } from '@/types/api';
import { useParams, useSearchParams } from 'next/navigation';
import { refillService } from '@/services/refillService';
import { shopService } from '@/services/shopService';
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { cartService } from '@/services/CartService';
import { packService } from '@/services/packService';

export default function ProductDetailsPage() {
  const { toast } = useToast();

  const [product, setProduct] = useState<
    RefillArticle | Article | null
  >(null);
  const [loading, setLoading] = useState(true);

  const [refillArticles, setRefillArticles] = useState<RefillArticle[]>([]);
  const [loadingRefillArticles, setLoadingRefillArticles] = useState(true);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const type = searchParams.get("type") as "article" | "refill";

  const volumes = ["1L", "2L", "5L"];

  const [selectedVolume, setSelectedVolume] = useState("1L");

  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth
  );

  const getVolumeNumber = (volume: string) =>
    Number(volume.replace("L", ""));


  useEffect(() => {
    if (type === "refill" && product && "volume" in product) {
      setSelectedVolume(product.volume || "1L");
    }
  }, [product, type]);

  const fetchProduct = async (
    id: string,
    type: "article" | "refill"
  ) => {
    try {
      let data;

      if (type === "refill") {
        data = await refillService.getRefillArticleById(id);
      } else {
        data = await shopService.getArticleById(id);
      }

      setProduct(data);
      console.log(data, "data")
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  async function fetchRefillArticles() {
    try {
      setLoadingRefillArticles(true);

      const data = await refillService.getRefillArticles();

      setRefillArticles(data);
    } catch (error) {
      console.error("Failed loading refill articles", error);
    } finally {
      setLoadingRefillArticles(false);
    }
  }

  async function fetchArticles() {
    try {
      setLoadingArticles(true);

      const data = await shopService.getArticles();

      setArticles(data);
    } catch (error) {
      console.error("Failed loading articles", error);
    } finally {
      setLoadingArticles(false);
    }
  }

  useEffect(() => {
    if (id && type) {
      fetchProduct(id, type);
    }
  }, [id, type]);

  useEffect(() => {
    fetchRefillArticles();
    fetchArticles();
  }, []);

  const relatedProducts = [
    ...articles.map((item) => ({
      ...item,
      type: "article"
    })),

    ...refillArticles.map((item) => ({
      ...item,
      type: "refill"
    }))
  ]
    .filter((item) => item._id !== id)
    .slice(0, 3);

  const handleAddToCart = async () => {
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
      // Check access for both article and refill
      const access = await packService.checkAccess();

      if (!access.canAccessShop) {
        toast({
          title: "Shop access required",
          description:
            "You need an active pack or a recent collection to access the shop.",
          variant: "destructive",
        });

        return;
      }


      // ==========================
      // REFILL PRODUCT
      // ==========================
      if (type === "refill") {

        const quantity = getVolumeNumber(selectedVolume);

        const refillPayload = {
          articleId: product._id,
          quantity: quantity,
          volume: selectedVolume,
          price: product.prix * quantity,
        };


        await cartService.addToRefillCart(
          refillPayload
        );


        toast({
          title: "Added to refill cart",
          description:
            `${product.nom} (${selectedVolume}) added successfully.`,
        });


        return;
      }

      // ==========================
      // NORMAL ARTICLE
      // ==========================

      const cartPayload = {
        articleId: product._id,
        quantity: 1,
      };


      await cartService.addToCart(
        cartPayload
      );

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

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex justify-center items-center py-40">
          Loading product...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-12 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Product Gallery */}
          <section className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden aspect-square shadow-lg">
              <img
                alt={product.nom}
                className="w-full h-full object-cover"
                src={`${API_URL}${product.photo}`}

              />
            </div>

            {/*<div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-lg overflow-hidden aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    alt={`${product.nom} view ${i}`}
                    className="w-full h-full object-cover"
                    src={product.photo}
                  />
                </div>
              ))}
            </div>*/}
          </section>


          {/* Product Details */}
          <section className="flex flex-col">

            <div className="mb-2">
              <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                {type === "refill"
                  ? "REFILLABLE SERIES"
                  : "PRODUCT SERIES"}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              {product.nom}
            </h1>

            <p className="text-2xl font-medium text-secondary mb-8">
              {type === "refill"
                ? (
                  product.prix *
                  getVolumeNumber(selectedVolume)
                ).toFixed(2)
                : product.prix}{" "}
              TND
            </p>

            {/* Eco Impact */}
            <div className="bg-surface-container-low rounded-xl p-6 mb-8 flex items-center gap-6">

              <div className="w-16 h-16 flex-shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="#e0eaed"
                    strokeWidth="3"
                  />

                  <path
                    d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="#006c4a"
                    strokeDasharray={`${Math.min(product.CO2_refill * 20, 100)},100`}
                    strokeWidth="3"
                  />
                </svg>
              </div>


              <div>
                <h4 className="text-on-surface font-bold text-sm uppercase tracking-widest mb-1">
                  Impact Metric
                </h4>

                <p className="text-on-surface-variant font-medium">
                  {type === "refill"
                    ? `Saves ${product.CO2_refill ?? 0}Kg of carbon emission`
                    : `Saves ${product.CO2}Kg of carbon emission`
                  }
                </p>
              </div>

            </div>


            {/* Details */}
            <div className="mb-8 space-y-4">

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  verified
                </span>

                <span className="text-on-surface font-semibold">
                  Category:
                </span>

                <span className="text-on-surface-variant">
                  {product.category.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  stars
                </span>

                <span className="text-on-surface font-semibold">
                  Reward:
                </span>

                <span className="text-on-surface-variant">
                  {product.points} points in reward per item
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  eco
                </span>

                <span className="text-on-surface font-semibold">
                  Description:
                </span>
              </div>

            </div>


            <p className="text-on-surface-variant leading-relaxed mb-10">
              {product.description}
            </p>


            {type === "refill" && (
              <div className="mb-10">

                <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3">
                  Select Volume
                </p>

                <div className="flex gap-2">

                  {volumes.map((vol) => (

                    <button
                      key={vol}
                      onClick={() => setSelectedVolume(vol)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selectedVolume === vol
                        ? "bg-primary-container/20 text-on-primary-container border-2 border-primary-container"
                        : "border border-outline-variant/30 hover:border-primary-container hover:bg-primary-container/5"
                        }`}
                    >
                      {vol}
                    </button>

                  ))}

                </div>

              </div>
            )}
            <div className="mt-auto flex flex-col sm:flex-row gap-4">


              <button
                onClick={handleAddToCart}
                className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold text-lg flex-1 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Add to Cart
              </button>


              <button
                className="border border-primary/20 text-secondary px-8 py-5 rounded-full font-bold hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined align-middle">
                  favorite
                </span>
              </button>

            </div>

          </section>

        </div>

        {/* Related Products */}
        <section className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Complementary Pieces</h2>
              <p className="text-on-surface-variant">Enhance your sustainable ritual.</p>
            </div>
            <Link
              href={type === "refill" ? "/refill-shop" : "/shop"}
              className="text-primary font-bold hover:underline transition-colors"
            >
              View All Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {relatedProducts.map((item) => (

              <Link
                key={`${item.type}-${item._id}`}
                href={`/product/${item._id}?type=${item.type}`}
              >

                <div className="group bg-surface-container-lowest p-4 rounded-xl shadow-lg transition-transform hover:-translate-y-2">

                  <div className="aspect-[4/5] rounded-lg overflow-hidden mb-6 bg-surface-container">

                    <img
                      alt={item.nom}
                      className="w-full h-full object-cover"
                      src={`${API_URL}${item.photo}`}
                    />

                  </div>


                  <h3 className="font-bold text-xl mb-1">
                    {item.nom}
                  </h3>


                  <p className="text-secondary font-medium mb-4">
                    {item.prix} TND
                  </p>


                  <div className="flex gap-2">

                    <span className="bg-surface-container px-2 py-1 rounded text-xs font-bold text-on-surface-variant">
                      {item.type === "refill"
                        ? "REFILL"
                        : "PRODUCT"}
                    </span>


                    {item.points && (
                      <span className="bg-surface-container px-2 py-1 rounded text-xs font-bold text-on-surface-variant">
                        ⭐ {item.points} pts
                      </span>
                    )}

                  </div>

                </div>

              </Link>

            ))}

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
