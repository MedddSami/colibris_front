"use client"

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Blog } from '@/types/blog'
import { blogService } from '@/services/BlogService'
import { Article, Chiffre, RefillArticle } from '@/types/api'
import { shopService } from '@/services/shopService'
import { refillService } from '@/services/refillService'
import { adminService } from '@/services/adminService'
import Image from 'next/image'

export default function Home() {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [refillArticles, setRefillArticles] = useState<RefillArticle[]>([]);
  const [loadingRefillArticles, setLoadingRefillArticles] = useState(true);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);


  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [chiffres, setChiffres] = useState<Chiffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchChiffres();
  }, []);


  const fetchChiffres = async () => {

    try {
      const data = await adminService.getChiffres();

      console.log(data, "chiffres Data");

      setChiffres(
        Array.isArray(data)
          ? data
          : data.chiffres ?? []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const stats = {
    pickups: chiffres.find((c) => c.label === "Pickups"),
    quantities: chiffres.find((c) => c.label === "Quantités"),
    recyclingRate: chiffres.find((c) => c.label === "Taux de recyclage"),
  };

  async function fetchBlogs() {
    try {
      setLoadingBlogs(true);

      const response = await blogService.getBlogs({
        limit: 3,
        featured: true,
        status: "published", // if your API supports it
      });

      setBlogs(response.blogs);
    } catch (error) {
      console.error("Failed loading blogs", error);
    } finally {
      setLoadingBlogs(false);
    }
  }

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
    fetchBlogs();
    fetchRefillArticles();
    fetchArticles();
  }, []);

  const shopPreview = [
    ...(refillArticles ?? []).map((item) => ({
      ...item,
      type: "refill" as const,
    })),
    ...(articles ?? []).map((item) => ({
      ...item,
      type: "article" as const,
    })),
  ]
    .slice(0, 4);

  const formatStatValue = (
    value?: number,
    suffix = ""
  ) => {
    if (value == null) return "";

    let formatted: string;

    if (value >= 1_000_000) {
      formatted = `${(value / 1_000_000).toFixed(
        value % 1_000_000 === 0 ? 0 : 1
      )}M`;
    } else if (value >= 1_000) {
      formatted = `${(value / 1_000).toFixed(
        value % 1_000 === 0 ? 0 : 1
      )}k`;
    } else {
      formatted = value.toString();
    }

    return `${formatted}${suffix}`;
  };

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center px-4 md:px-8 py-20 bg-mesh-gradient bg-surface">
          {/* Watermark Logo */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center overflow-hidden">
            <img
              alt=""
              className="w-[150%] max-w-none grayscale"
              src="https://lh3.googleusercontent.com/aida/ADBb0ui4FP64f8HgCmkFdoG_ud44d5tZem1oeN5WFeiYxvV0LjDs_VrPGxE2ru_oDZLSp6kPtPr3etVw79MdKnOzNZCacASCgBsqwYte9fh9XKggZOgjr53sNnaMrvWZSxrG7LEHEIIrWXhN1uAw6X-O0U4tI32HiDLkG6qxexCqsRDdmFRVSPRI00zCxLvW167jJw5oK9_YDN-VAFc-xMKIkIY4XnGNqVvj6GVcnQ8mXu8qIiuX8exW5gadziQiDW0ji7zkN4wl_e2iuwU"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
            {/* Content Side */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <Badge variant="primary" className="mb-8">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Future of Circularity
              </Badge>

              <h1 className="text-display-lg text-on-surface mb-8">
                Toward a <span className="text-primary italic">Circular</span> Future
              </h1>

              <p className="text-body-lg text-on-surface/70 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed">
                Join the regenerative movement. We simplify circularity through seamless waste collection and a premium refill ecosystem designed for the modern home.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/auth/signup">
                  <Button size="lg" variant="primary">
                    Get Started
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button size="lg" variant="secondary">
                    Explore shop
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Side */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>

                {/* Main 3D Visual */}
                <div className="relative z-20" style={{ animation: 'float 6s ease-in-out infinite' }}>
                  <img
                    alt="3D hummingbird animation"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcDaQStS4STbmg0cZ--4w0r--TsLpSneFlemWpiFkRTrtR9vwWKs6JvkPty_Zt3GckY__Efq3ThYCts1oh1WWT7mcE8lvBRar6qVQRHrq04tPTy_iMPyWtSqB60jkX9kl_6WzqyfQFWJv0-5vlQyvjvWeahTcRnIpWa-e-6k-DXYcVXFQav9UTfMaOmAjw48yQBHv1dmR9HyDPnyuDbotToUcYrVDJRHVQ6Jff-3iHzYD_o8RZrKHCIPZOGcrlzu6MZOyERbRyQxoa"
                  />
                </div>

                {/* Floating Accent Elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/10 backdrop-blur-3xl rounded-3xl border border-white/20 flex items-center justify-center opacity-50">
                  <span className="material-symbols-outlined text-secondary text-4xl">eco</span>
                </div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center opacity-50">
                  <span className="material-symbols-outlined text-primary text-5xl">recycle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to discover</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="px-4 md:px-8 py-12 -mt-10 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-primary text-display-lg mb-2">{stats.quantities
                ? formatStatValue(
                  stats.quantities.numericValue,
                  stats.quantities.suffix
                )
                : "50k+"}</div>
              <div className="text-on-surface/60 text-label-md tracking-widest uppercase">TONS WASTE COLLECTED</div>
            </Card>
            <Card className="text-center">
              <div className="text-secondary text-display-lg mb-2">{stats.pickups
                ? formatStatValue(
                  stats.pickups.numericValue,
                  stats.pickups.suffix
                )
                : "10k+"}</div>
              <div className="text-on-surface/60 text-label-md tracking-widest uppercase">PICKUPS ASSURED </div>
            </Card>
            <Card className="text-center">
              <div className="text-tertiary text-display-lg mb-2"> {stats.recyclingRate?.valeur ?? "100%"}</div>
              <div className="text-on-surface/60 text-label-md tracking-widest uppercase">RECIRCULATION RATE</div>
            </Card>
          </div>
        </section>

        {/* Partners Marquee */}
        <section className="py-12 bg-surface overflow-hidden border-y border-surface-container">
          <div className="max-w-7xl mx-auto px-8 mb-8">
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">We share the same values and the same vision</h3>
          </div>

          {/* Left fade */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

          <div className="flex overflow-hidden whitespace-nowrap group">

            <div className="flex animate-marquee items-center gap-16 min-w-full">
              {/* Original logos */}
              <img alt="A table l'épicerie fine"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/1.png" />
              <img alt="Patagonia"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/2.png" />
              <img alt="Aeros Innovation Center"
                className="h-24 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/aeros-logo.png" />
              <img alt="IcStartUp"
                className="h-24 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/icstartup_logo.png" />
              <img alt="Dvancia"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/3.png" />
              <img alt="Value"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/4.png" />
              <img alt="ASF Consulting"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/5.png" />
              <img alt="Attijari Leasing"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/6.png" />
              <img alt="WeBankABC"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/7.png" />
              <img alt="British Academy of Tunis"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/8.png" />
              <img alt="Decathlon"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/9.png" />
              <img alt="Expenseya"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/10.png" />
              <img alt="Express FM"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/11.png" />
              <img alt="EY Tunisia"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/12.png" />
              <img alt="Instadeep"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/13.png" />
              <img alt="iObeya"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/14.png" />
              <img alt="Kyranis Travel"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/15.png" />
              <img alt="lab''ess Groupe SOS"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/16.png" />
              <img alt="Lycée Français Pierre mendès France"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/17.png" />
              <img alt="Mass Analytics"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/18.png" />
              <img alt="MDN Company"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/19.png" />
              <img alt="MediaNet"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/20.png" />
              <img alt="Med"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/21.png" />
              <img alt="Merck"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/22.png" />
              <img alt="novo nordisk"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/23.png" />
              <img alt="Orallia Recordati"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/24.png" />
              <img alt="Pwc Tunisia"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/25.png" />
              <img alt="Red Pepper Agency"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/26.png" />
              <img alt="Sodexo"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/27.png" />
              <img alt="Sofrecom"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/28.png" />
              <img alt="Soul & Planet"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/29.png" />
              <img alt="Star Assurances"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/30.png" />
              <img alt="Startup Village"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/31.png" />
              <img alt="SVR Laboratoire Dermatologique"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/32.png" />
              <img alt="Talan"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/33.png" />
              <img alt="Talys"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/34.png" />
              <img alt="Tunisian Center for Social Entrepreneurship"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/35.png" />
              <img alt="3C"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/36.png" />
              <img alt="Think it"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/37.png" />
              <img alt="T>>"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/38.png" />
              <img alt="UL"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/39.png" />
              <img alt="Value"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/40.png" />
              <img alt="Vivo Energy"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/41.png" />
              <img alt="Voluntàs"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/42.png" />
              <img alt="Wood Space"
                className="h-16 opacity-60 hover:grayscale-50 hover:opacity-100 transition-all duration-300 mx-8 object-contain"
                src="/43.png" />

            </div>
          </div>
        </section>


        {/* Section 1: HOW IT WORKS */}
        <section className="relative overflow-hidden px-8 py-16">
          <div className="organic-blob absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-primary/5 blur-3xl"></div>
          <div className="organic-blob absolute right-0 bottom-0 h-80 w-80 translate-x-1/4 translate-y-1/4 bg-secondary/5 blur-3xl"></div>

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-0">
              <div className="group relative w-full lg:w-3/5">
                <div className="relative aspect-[4/3] rounded-[2rem] shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    src="/section1.png"
                    alt="Biophilic interior with person recycling"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="organic-blob absolute -top-12 -right-12 z-10 h-48 w-48 animate-pulse bg-primary/10"></div>

                <div className="absolute -bottom-16 -left-16 z-10 hidden h-64 w-64 rounded-full border-2 border-primary/20 md:block"></div>

                {/*<div className="absolute right-8 bottom-8 z-30 hidden max-w-xs rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-md md:block">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      eco
                    </span>
                    <span className="text-sm font-bold uppercase tracking-widest">
                      Biophilic Standard
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Designed to integrate seamlessly into modern, nature-forward
                    homes.
                  </p>
                </div>*/}
              </div>

              <div className="z-40 w-full rounded-3xl border border-white/50 bg-surface/80 p-10 shadow-xl backdrop-blur-sm md:p-14 lg:-ml-20 lg:w-2/5">
                <h2 className="mb-6 font-headline text-4xl leading-tight font-bold text-on-surface md:text-5xl">
                  HOW IT <span className="italic text-primary">WORKS</span>
                </h2>

                <p className="mb-10 text-lg leading-relaxed text-on-surface-variant">
                  From booking your pickup appointment to giving recyclable
                  materials a second life, learn how Colibris makes eco-commitment
                  simple, seamless, and aesthetically rewarding.
                </p>

                <Link
                  href="/our-process"
                  className="group relative inline-flex rounded-xl bg-primary px-10 py-5 text-sm font-bold tracking-widest text-white uppercase shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:bg-primary-container hover:shadow-primary/40"
                >
                  DISCOVER OUR PROCESS

                  <span className="material-symbols-outlined ml-2 align-middle transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: RECYCLABLE MATERIALS GUIDE */}
        <section className="relative overflow-hidden bg-secondary/5 py-16">
          <div className="mx-auto max-w-7xl px-8">
            <div className="relative flex min-h-[600px] items-center overflow-hidden rounded-[3rem] shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img
                  src="/section2.png"
                  alt="Artistic composition of recyclables"
                  className="h-full w-full scale-105 object-cover transition-transform duration-[2000ms] hover:scale-100"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent"></div>
              </div>

              <div className="relative z-10 w-full p-12 md:p-20 lg:w-1/2">
                <h2 className="mb-8 font-headline text-4xl leading-tight font-bold text-white md:text-6xl">
                  What defines{" "}
                  <span className="text-secondary-fixed">RECYCLABLE</span>?
                </h2>

                <p className="mb-12 max-w-lg text-xl leading-relaxed text-white/90">
                  Not all waste is created equal. Our curated guide helps you
                  identify materials that are ready for a second life, from
                  shimmering glass to pure aluminum.
                </p>

                <div className="mb-12 flex flex-wrap gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-secondary-fixed">
                      A+
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/70">
                      Purity Rating
                    </div>
                  </div>

                  <div className="h-12 w-px bg-white/20"></div>

                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-secondary-fixed">
                      98%
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/70">
                      Circular Factor
                    </div>
                  </div>
                </div>

                <Link href="/what-can-be-recycled">
                  <button className="rounded-full bg-white px-12 py-5 text-sm font-extrabold tracking-widest text-secondary uppercase shadow-2xl transition-all hover:scale-105 hover:bg-secondary-fixed">
                    EXPLORE THE GUIDE
                  </button>
                </Link>
              </div>

              {/*<div className="absolute top-12 right-12 hidden rounded-2xl border border-white/20 bg-secondary/30 p-6 backdrop-blur-xl lg:block">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="material-symbols-outlined text-4xl text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>

                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      Ocean Blue
                    </div>
                    <div className="text-[10px] uppercase tracking-tighter text-white/60">
                      Standard Certified
                    </div>
                  </div>
                </div>
              </div>*/}
            </div>
          </div>
        </section>

        {/* Section 3: REWARDS & PARTNER PACKS */}
        <section className="relative overflow-hidden py-16">
          <div className="relative z-10 mx-auto max-w-7xl px-8">
            <div className="flex flex-col items-center gap-20 lg:flex-row">
              <div className="lg:w-2/5">
                <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                  <span className="material-symbols-outlined text-sm">
                    handshake
                  </span>
                  PARTNER PERKS
                </div>

                <h2 className="mb-8 font-headline text-4xl leading-tight font-bold text-on-surface md:text-5xl">
                  Reward your{" "}
                  <span className="italic text-secondary">Commitment</span>
                </h2>

                <p className="mb-10 text-lg leading-relaxed text-on-surface-variant">
                  Our high-end collaborator wall features eco-conscious brands
                  offering exclusive benefits. Shop your essentials and have them
                  delivered during your next collection.
                </p>

                <Link href="/packs-initiatives">
                  <button className="rounded-full bg-white px-12 py-5 text-sm font-extrabold tracking-widest text-secondary uppercase shadow-2xl transition-all hover:scale-105 hover:bg-secondary-fixed">
                    {/* Your button text */}
                    LEARN MORE
                  </button>
                </Link>
              </div>

              <div className="relative lg:w-3/5">
                <div className="organic-blob absolute scale-110"></div>

                <div className="relative p-8">
                  <img
                    src="/enseignes.png"
                    alt="Partner Brands"
                    className="h-auto w-full object-contain opacity-90 mix-blend-multiply"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Preview */}
        <section className="px-4 md:px-8 py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-headline-lg text-on-surface">
                Shop Essentials
              </h2>

              <Link
                href="/shop"
                className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
              >
                View Catalog
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loadingArticles || loadingRefillArticles ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <p className="text-on-surface-variant">
                    Loading products...
                  </p>
                </div>
              ) : (
                shopPreview.map((item) => (
                  <Link
                    key={`${item.type}-${item._id}`}
                    href={`/product/${item._id}?type=${item.type}`}
                    className="block"
                  >
                    <Card className="overflow-hidden hover:shadow-soft transition-all cursor-pointer bg-surface-container-lowest">
                      <div className="aspect-square relative overflow-hidden bg-surface-container -m-6 mb-6">
                        <img
                          src={`${API_URL}${item.photo}`}
                          alt={item.nom}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />

                        <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-on-primary px-3 py-1 rounded-full text-label-md font-bold">
                          {item.type === "refill" ? "Refill 🌱" : "Article "}
                        </span>
                      </div>

                      <div className="text-center">
                        <h4 className="text-title-lg mb-2 text-on-surface line-clamp-2">
                          {item.nom}
                        </h4>
                        <p className="text-md mb-2 text-on-surface line-clamp-2">
                          {item.description}
                        </p>
                        <div className="text-secondary text-headline-md">
                          {item.prix} TND
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-4 md:px-8 py-24 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[32px] bg-primary p-10 md:p-20 shadow-soft">

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary-container/20 blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-4 items-center">

              {/* Left */}
              <div>
                <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-bold tracking-[0.25em] uppercase text-on-primary mb-4">
                  Trusted by Tunisian Families
                </span>

                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-yellow-300"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>

                <blockquote className="text-3xl md:text-4xl font-semibold leading-relaxed text-on-primary">
                  “Since joining Colibris, separating our recyclables has become part of
                  our family's weekly routine. The collection points are convenient, the
                  rewards keep the kids motivated, and we know we're helping keep Tunisia
                  cleaner for the next generation.”
                </blockquote>

                <div className="flex items-center gap-4 mt-4">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeZ1mvOCLqB2h2BFkRojZs7kHFDFP_Anfj8uZeZoS39bIlIpcQ3AZ5oij69EN1wReK47GiSMeZ9_xJBxPwV7Zl98qpwwVgDsniIsm5fO9gbV9urRYk2wQxJwAYKWQxwSgknWTFjsQws349Z02YbiRAsFeaES21rL-Zv1YOQq0IwDAyWlOMDzkNuBW5frr-U-Ljq4iQjEkeEdh9eDSMrCyWrnBM924D5Xoj0UkLRSg31TLAdeYbZqM7HMXJ0mW8M1Vgq7NMVtTmL_lT"
                    alt="Amina Ben Salem"
                    className="h-16 w-16 rounded-full object-cover border-2 border-white/30"
                  />

                  <div>
                    <h4 className="text-xl font-semibold text-on-primary">
                      Amina Ben Salem
                    </h4>

                    <p className="text-on-primary/75 uppercase tracking-[0.2em] text-sm">
                      Tunis Resident
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="grid gap-5">
                <Image
                  src="/logo_horizontal_+_tagline_blanc_rvb.png"
                  alt="User feedback screenshot"
                  width={400}
                  height={300}
                />

                <Card className="bg-white/10 border-white/10 text-on-primary backdrop-blur-sm">
                  <div className="text-5xl font-black mb-2">5,000+</div>
                  <div className="uppercase tracking-widest text-sm opacity-75">
                    Active Community Members
                  </div>
                </Card>

                <Card className="bg-white/10 border-white/10 text-on-primary backdrop-blur-sm">
                  <div className="text-5xl font-black mb-2">95%</div>
                  <div className="uppercase tracking-widest text-sm opacity-75">
                    Satisfaction Rate
                  </div>
                </Card>



              </div>
            </div>
          </div>
        </section>
        {/* (Blog) section */}
        <section className="px-8 py-24 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-headline font-bold text-4xl text-on-surface">
                Colibris Insights
              </h2>

              <Link
                href="/blog"
                className="text-primary font-bold flex items-center gap-2 hover:underline transition-colors"
              >
                View All
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loadingBlogs ? (
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(20,29,32,0.06)] animate-pulse"
                  >
                    <div className="aspect-video bg-surface-container" />

                    <div className="p-6 space-y-4">
                      <div className="h-3 w-24 rounded-full bg-surface-container" />

                      <div className="h-6 w-4/5 rounded bg-surface-container" />

                      <div className="space-y-2">
                        <div className="h-4 rounded bg-surface-container" />
                        <div className="h-4 w-3/4 rounded bg-surface-container" />
                      </div>
                    </div>
                  </div>
                ))
              ) : blogs.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-lowest py-20 px-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">
                    article
                  </span>

                  <h3 className="text-2xl font-bold text-on-surface">
                    No Articles Yet
                  </h3>

                  <p className="mt-3 max-w-md text-on-surface-variant">
                    We're working on fresh sustainability stories and ecosystem insights.
                    Check back soon for our new events and stories.
                  </p>

                  <Link
                    href="/blog"
                    className="mt-8 rounded-full bg-primary px-6 py-3 font-bold text-on-primary transition hover:opacity-90"
                  >
                    Visit the Blog
                  </Link>
                </div>
              ) : (
                blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog-post/${blog.slug}`}
                    className="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(20,29,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_40px_rgba(20,29,32,0.12)]"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={`${API_URL}/${blog.featuredImage.url}`}
                        alt={blog.featuredImage.alt || blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                        {blog.BlogCategory}
                      </span>

                      <h3 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                        {blog.title}
                      </h3>

                      <p className="line-clamp-3 text-sm text-on-surface-variant">
                        {blog.excerpt || blog.subtitle}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
        {/* Ready to close the loop CTA */}
        <section className="px-8 py-24 text-center max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-5xl mb-6">Ready to design a better world?</h2>
          <p className="text-body-lg text-on-surface-variant mb-12">Join thousands of households making sustainability
            effortless. Start your circular journey today with Colibris.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-primary text-on-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-container transition-all inline-flex items-center justify-center"
            >
              Discover our shop
            </Link>

            <Link
              href="/contact"
              className="bg-secondary text-on-secondary px-10 py-5 rounded-xl font-bold text-lg hover:bg-on-secondary-container transition-all inline-flex items-center justify-center"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/*<style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>*/}
    </>
  )
}
