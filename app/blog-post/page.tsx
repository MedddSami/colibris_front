'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function BlogPostPage() {
    return (
        <>
            <Navbar />
            <main className="bg-surface min-h-screen max-w-[1440px] mx-auto px-1 pt-24">
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-12 text-sm text-neutral-700 font-medium">
                        <Link className="hover:text-primary-700 transition-colors" href="/blog">
                            Blog
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link className="hover:text-primary-700 transition-colors" href="#" >
                            Circular Economy
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-neutral-900 truncate max-w-[200px] md:max-w-none">
                            The Future of Circular Design
                        </span>
                    </nav>

                    {/* Hero Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
                        <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-2xl">
                            <img
                                alt="Biophilic Architecture"
                                className="w-full aspect-[16/10] object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB_dA7IVCfVhhadp4NOeWEcO0Ydh22RdgVJaWYu2UYpk_-d2yDs9J6EjprpseA-EaX56ovCCzMCHBCx7E4mB80rDSjgDDUiw_Tpn1pO1FJEvcOD9Zube_EsISdLfTa290hqoWbNytBR9OQI3X8G8OQDoB-IDtRo0Tqhr-t4MD5ipnIvbN5gPylfQVGJB_3_353a4xWwOiTcF7nha5bRApXY4-KvLljoeIOr2h0CThA7Wu3bR-AwqRBtWUIXurw-jA-ePEpcz-id8UB"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>

                        <div className="lg:col-span-4 lg:mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-white text-sm font-bold mb-6">
                                Circular Economy
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight mb-8">
                                The Future of Circular Design: Why Biophilic Architecture Matters
                            </h1>
                            <div className="flex items-center gap-4 border-t border-neutral-200/30 pt-8">
                                <img
                                    alt="Sarah Jenkins"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-surface"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk2UcB4ok2-Jjz-fxIW629TTH6Pe3GfJxqOwOqnDm8NrQR-PjHJrAU219mN7GqNmejgHxcGtP9j4n61h7RDm3l0rFz7qCWQLrENsX3RX75FSnVBNHJqBdEDdIaBGmuOYT-Dos5pj_nufqHQ6Er1CssEeWeMsK6rBCOefUt9FtIU0VilBKOABxWDxWxoHxG0fILxyv_lVcOv0yxkFm4tLi9NvU7K_EzJ9jmAXw2stTgjZkELYJBLLCnIOrMdKachWwrk1lGTWWZO-Zk"
                                />
                                <div>
                                    <p className="font-bold text-neutral-900">Sarah Jenkins</p>
                                    <p className="text-sm text-neutral-700">Nov 14, 2024 • 8 min read</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                        {/* Article Content */}
                        <article className="lg:col-span-8 space-y-8">
                            <p className="text-xl text-neutral-600 font-medium leading-relaxed italic border-l-4 border-primary pl-8">
                                In an era defined by environmental urgency, the intersection of nature and architecture offers a path toward true circularity. Colibris is leading this shift, transforming how we perceive the built environment.
                            </p>

                            <p className="text-neutral-600 leading-relaxed">
                                Architecture has long been viewed as a static intervention—a structure placed upon the land. However, the principles of biophilic design suggest that our spaces should not just occupy space but actively participate in the ecosystem. At Colibris, our mission is to fuse these biological imperatives with circular economy frameworks, ensuring that every material used has a future beyond its current form.
                            </p>

                            <h2 className="text-3xl font-bold text-neutral-900 mt-8 mb-4">Restoring the Biological Connection</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                The essence of biophilic design lies in our fundamental need to connect with nature. This isn't merely aesthetic—it's rooted in human psychology. Spaces that incorporate natural elements, materials, and patterns demonstrate measurable improvements in occupant well-being.
                            </p>

                            <p className="text-neutral-600 leading-relaxed">
                                By carefully selecting locally sourced, regenerative materials and implementing them in modular, disassemblable systems, we create architecture that supports both people and planet. Every refill pack, every shipping container, every interior surface becomes an opportunity to demonstrate a commitment to circularity.
                            </p>

                            <h2 className="text-3xl font-bold text-neutral-900 mt-8 mb-4">The Business Case for Circular Architecture</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                Sustainability is no longer a niche concern. Companies across industries are recognizing that circular business models aren't just ethically sound—they're economically advantageous. Reduced material waste, optimized supply chains, and enhanced brand loyalty create a compelling financial case.
                            </p>

                            <p className="text-neutral-600 leading-relaxed">
                                At Colibris, we've embedded circularity into every layer of our operation. Our refill system eliminates packaging waste while deepening customer engagement. Our collections infrastructure transforms what would be waste streams into valuable material inputs. This is the blueprint for sustainable enterprise.
                            </p>

                            <h2 className="text-3xl font-bold text-neutral-900 mt-8 mb-4">Looking Forward</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                The future of design is intrinsically linked to our willingness to reimagine systems. As we face the climate crisis, half-measures are insufficient. We need transformative approaches that treat architecture, product design, and supply chain management as integrated expressions of our values.
                            </p>

                            <p className="text-neutral-600 leading-relaxed">
                                Biophilic, circular design isn't a trend—it's an imperative. And it's already being built. Join the movement at Colibris.
                            </p>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Author Card */}
                            <div className="bg-neutral-100 rounded-xl p-8 sticky top-24">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <img
                                        alt="Sarah Jenkins"
                                        className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk2UcB4ok2-Jjz-fxIW629TTH6Pe3GfJxqOwOqnDm8NrQR-PjHJrAU219mN7GqNmejgHxcGtP9j4n61h7RDm3l0rFz7qCWQLrENsX3RX75FSnVBNHJqBdEDdIaBGmuOYT-Dos5pj_nufqHQ6Er1CssEeWeMsK6rBCOefUt9FtIU0VilBKOABxWDxWxoHxG0fILxyv_lVcOv0yxkFm4tLi9NvU7K_EzJ9jmAXw2stTgjZkELYJBLLCnIOrMdKachWwrk1lGTWWZO-Zk"
                                    />
                                    <h3 className="text-lg font-bold text-neutral-900">Sarah Jenkins</h3>
                                    <p className="text-sm text-neutral-700 mb-4">Sustainability Architect</p>
                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                        Sarah leads design strategy at Colibris, exploring the intersection of biophilic principles and circular economy frameworks.
                                    </p>
                                </div>
                                <button className="w-full bg-primary-700 text-white py-3 rounded-xl font-bold text-sm mt-6 hover:bg-primary/90 transition-colors">
                                    Follow Author
                                </button>
                            </div>

                            {/* Related Articles */}
                            <div className="bg-neutral-100 rounded-xl p-8">
                                <h3 className="text-lg font-bold text-neutral-900 mb-6">Related Articles</h3>
                                <div className="space-y-6">
                                    {[
                                        {
                                            title: 'Designing for Disassembly',
                                            category: 'Design',
                                            date: 'Oct 28, 2024'
                                        },
                                        {
                                            title: 'Material Innovation in 2025',
                                            category: 'Innovation',
                                            date: 'Oct 15, 2024'
                                        }
                                    ].map((item, i) => (
                                        <Link
                                            key={i}
                                            href="#"
                                            className="block group hover:translate-x-1 transition-transform"
                                        >
                                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary-700 text-xs font-bold mb-2">
                                                {item.category}
                                            </span>
                                            <p className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-neutral-700 mt-1">{item.date}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
