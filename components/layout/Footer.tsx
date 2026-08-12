import Image from 'next/image'
import Link from 'next/link'
import {
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-6">
          {/* Brand */}
          <div>
            <Link href="/">
              <Image
                alt="Colibris Logo"
                className="mb-4 object-contain"
                src="/logo_horizontal_+_tagline_rvb.png"
                width={250}
                height={80}
                priority
              />
            </Link>
            <p className="text-sm text-foreground/70">
              Leading the circular economy through seamless waste collection and premium refill solutions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/refill-shop"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Refill Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/packs-initiatives"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Packs & Initiatives
                </Link>
              </li>

            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms&conditions"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              {/*<li>
                <Link
                  href="#"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>*/}
            </ul>
          </div>
        </div>

        {/* Divider Replacement */}
        <div className="pt-6 mt-6 bg-surface-container/50 -mx-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8">
            <p className="text-label-md text-on-surface/60">
              © {new Date().getFullYear()} Colibris. All rights reserved. Created with ❤️ by{" "}
              <a
                href="https://www.aeros-advising.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Aeros Innovation Center
              </a>
            </p>
            <div className="flex gap-8">
              <Link
                href="https://wa.me/+21658330734"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface hover:text-primary transition-colors"
              >
                <FaWhatsapp size={22} />
              </Link>

              <Link
                href="https://www.facebook.com/colibristunisie?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface hover:text-primary transition-colors"
              >
                <FaFacebookF size={22} />
              </Link>

              <Link
                href="https://www.linkedin.com/in/selim-ben-ahmed-598b9956/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface hover:text-primary transition-colors"
              >
                <FaLinkedinIn size={22} />
              </Link>

              <Link
                href="https://www.instagram.com/colibristunisie/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface hover:text-primary transition-colors"
              >
                <FaInstagram size={22} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
