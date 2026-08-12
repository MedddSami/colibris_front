'use client'

import { authService } from '@/services/authService'
import { cartService } from '@/services/CartService'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (state: RootState) => state.auth
  );

  const dashboardHref =
    user?.role === "admin" ? "/admin" : "/dashboard";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const profile = await authService.getProfile();
        setProfileImage(profile.profileImage ?? null);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) return;
      try {
        const [normalCart, refillCart] = await Promise.all([
          cartService.getCart(),
          cartService.getRefillCart(),
        ]);

        const normalCount = normalCart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        const refillCount = refillCart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setCartCount(normalCount + refillCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);


  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-[20px] shadow-soft">
      <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="text-display-lg text-primary scale-50 -ml-8 origin-left">
          <Image
            src="/logo_horizontal_+_tagline_rvb.png"
            alt="Colibris logo"
            width={280}
            height={100}
            priority
          />
        </Link>

        {/* Desktop Navigation (unchanged) */}
        <div className="hidden md:flex items-center space-x-12">
          <Link
            href="/shop"
            className={`text-body-lg transition-all duration-300 ${isActive('/shop')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            Shop
          </Link>
          <Link
            href="/refill-shop"
            className={`text-body-lg transition-all duration-300 ${isActive('/refill-shop')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            Refill Shop
          </Link>
          <Link
            href="/packs-initiatives"
            className={`text-body-lg transition-all duration-300 ${isActive('/packs-initiatives')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            Packs & Initiatives
          </Link>
          <Link
            href="/blog"
            className={`text-body-lg transition-all duration-300 ${isActive('/blog')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={`text-body-lg transition-all duration-300 ${isActive('/about')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-body-lg transition-all duration-300 ${isActive('/contact')
              ? 'text-primary font-bold'
              : 'text-on-surface/60 hover:text-primary hover:opacity-80'
              }`}
          >
            Contact
          </Link>
        </div>

        {/* Right Side: Cart -> Auth -> Mobile Menu Toggle (in that order, on every breakpoint) */}
        <div className="flex items-center gap-3">

          {/* 1. Cart */}
          <Link
            href="/cart"
            className="text-on-surface-variant hover:text-primary scale-95 active:opacity-80 transition-transform"
            aria-label="Shopping cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-white px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 2. Auth Buttons — now visible on mobile as well, not just desktop */}
          <div className="flex items-center gap-3">
            {!mounted ? (
              <div className="w-24 h-10 rounded-full bg-surface-container animate-pulse" />
            ) : !isInitialized ? (
              <div className="w-24 h-10" /> // skeleton/placeholder, avoids flash
            ) : isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-surface-container transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={`${API_URL}${profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-primary">
                      person
                    </span>
                  )}
                </div>

                <span className="hidden md:inline font-medium text-on-surface">
                  Dashboard
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-5 py-2 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="hidden md:inline-block px-5 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                >
                  Join movement
                </Link>
              </>
            )}
          </div>

          {/* 3. Mobile Menu Toggle — now a direct sibling, no longer trapped inside a hidden-on-mobile wrapper */}
          <button
            className="md:hidden text-on-surface-variant p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile dropdown menu (unchanged) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface backdrop-blur-xl shadow-lg">
          <div className="flex flex-col px-8 py-8 space-y-4">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              Shop
            </Link>

            <Link
              href="/refill-shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              Refill Shop
            </Link>

            <Link
              href="/packs-initiatives"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              Packs & Initiatives
            </Link>

            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              Blog
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-title-lg text-on-surface/60 font-bold hover:text-primary transition-colors py-2"
            >
              Contact
            </Link>
          </div>
        </div>
      )}

    </nav>
  )
}
