'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-0 bg-surface">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden bg-mesh-gradient">
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero background"
              className="w-full h-full object-cover brightness-75"
              src="/logo_horizontal_+_tagline_rvb.png"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 via-on-surface/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <Badge variant="primary" className="mb-8">OUR MISSION</Badge>
              <h1 className="text-display-lg text-white mb-8">
                Cultivating a <span className="text-primary-fixed">Regenerative</span> Future
              </h1>
              <p className="text-body-lg text-white/90 leading-relaxed max-w-xl font-medium">
                Inspired by the small but tireless hummingbird, we design systems that give back more than they take.
              </p>
            </div>
          </div>
        </section>

        {/* The Colibris Story */}
        <section className="py-40 bg-surface-container-low">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="text-headline-lg text-primary mb-6">The Colibris Story</h2>
              <p className="text-on-surface/60 text-body-lg max-w-2xl mx-auto leading-relaxed">A decade of evolution from a local craft studio to a global beacon of regenerative design.</p>
            </div>
            <div className="space-y-20">
              {[
                { year: '2014', title: 'From Mghira Tunis', desc: 'Our journey began in the blue-and-white alleys of Tunisia, where traditional craftsmanship meets timeless Mediterranean culture.' },
                { year: '2019', title: 'The Pivot to Impact', desc: 'Recognizing the urgency of the climate crisis, we integrated circular economy models into our design studio, transforming waste into high-end objects.' },
                { year: 'Today', title: 'A Global Movement', desc: 'Today, Colibris operates as a decentralized ecosystem, bridging the gap between local artisans and global impact initiatives through our biophilic gallery model.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-12 items-start relative pb-20 border-l-2 border-primary/10 pl-12 ml-6 md:ml-0 md:pl-0 md:border-l-0">
                  <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(0,108,74,0.4)]"></div>
                  <div className="hidden md:flex flex-1 justify-end items-center pr-16 text-right">
                    <span className="text-primary font-black text-headline-md opacity-40">{item.year}</span>
                  </div>
                  <div className="flex-1 md:pl-16">
                    <span className="md:hidden text-primary font-bold text-label-md mb-3 block">{item.year}</span>
                    <h4 className="text-title-lg mb-4 text-on-surface">{item.title}</h4>
                    <p className="text-on-surface/60 leading-relaxed text-body-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-40 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div className="max-w-2xl">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Our
                  Team</span>
                <h2 className="text-4xl md:text-5xl font-bold text-on-surface text-editorial">The Minds Behind the
                  Movement</h2>
              </div>
              <p className="text-on-surface-variant max-w-sm mb-1">A diverse collective of designers, ecologists, and
                craftspeople united by a singular vision.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { name: 'Selim Slimi.', role: 'Founder & Creative Director', quote: '"Engineering mycelium-based infrastructure for zero-waste logistics hubs."' },
                { name: 'Sofiane B.', role: 'Co-Founder & Systems Architect', quote: '"Engineering mycelium-based infrastructure for zero-waste logistics hubs."' },
                { name: 'Elena R.', role: 'Lead Landscape Architect', quote: '"Creating vertical micro-climates that support endangered pollinator species."' },
                { name: 'Amine M.', role: 'Material Innovator', quote: '"Upcycling olive wood offcuts into high-performance structural elements."' },
              ].map((person, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] rounded-md overflow-hidden mb-8 bg-surface-container shadow-soft">
                    <img alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://via.placeholder.com/400x500" />
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">{person.name}</h4>
                  <p className="text-primary font-medium text-sm mb-4 uppercase tracking-widest">{person.role}</p>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <p className="text-body-sm text-on-surface/60 italic leading-relaxed">{person.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-32 bg-on-background text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="mb-24">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-editorial">Our Core Pillars</h2>
              <p className="text-white/60 text-xl max-w-2xl leading-relaxed">These aren't just principles; they are the architectural DNA of everything we create.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {[
                { title: 'Regenerative Sustainability', icon: 'recycling', desc: 'We move beyond neutral. Our projects are designed to actively heal ecosystems.' },
                { title: 'Biophilic Innovation', icon: 'biotech', desc: 'Nature is our primary R&D lab. We utilize generative AI to mimic natural growth patterns.' },
                { title: 'Communal Resilience', icon: 'diversity_3', desc: 'Sustainability is social. We empower local craft ecosystems by integrating traditional artisans.' },
                { title: 'Uncompromising Aesthetics', icon: 'draw', desc: 'Beauty is a functional requirement. We believe sustainability must be irresistibly beautiful.' },
              ].map((pillar, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center text-primary-fixed group-hover:bg-primary/20 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl">{pillar.icon}</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-primary-fixed">{pillar.title}</h3>
                    <p className="text-white/70 text-lg leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Impact in Motion */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-editorial">Impact in Motion</h2>
                <p className="text-primary-fixed-dim text-lg">Real numbers. Real change. Transparently tracked.</p>
              </div>
              <button
                className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-secondary-fixed transition-colors">View
                Live Ledger</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="border-t border-white/20 pt-8">
                <div className="text-6xl font-extrabold mb-2">500+</div>
                <div className="text-xl font-medium opacity-80 mb-4">Tons Collected</div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed w-3/4 h-full"></div>
                </div>
              </div>
              <div className="border-t border-white/20 pt-8">
                <div className="text-6xl font-extrabold mb-2">350+</div>
                <div className="text-xl font-medium opacity-80 mb-4">Happy Customers</div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed w-full h-full"></div>
                </div>
              </div>
              <div className="border-t border-white/20 pt-8">
                <div className="text-6xl font-extrabold mb-2">5k</div>
                <div className="text-xl font-medium opacity-80 mb-4">Community members</div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed w-1/2 h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Our Studio */}
        <section className="py-24 bg-surface-container">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img alt="about1" className="w-full h-64 object-cover rounded-xl shadow-lg"
                    src="/about1.png" />
                  <img alt="about3" className="w-full h-80 object-cover rounded-xl shadow-lg"
                    src="/about3.png" />
                </div>
                <div className="pt-12">
                  <img alt="about2" className="w-full h-full object-cover rounded-xl shadow-lg"
                    src="/about2.png" />
                </div>
              </div>
              <div className="lg:col-span-5 px-4">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Our Tunisian
                  Roots</span>
                <h2 className="text-4xl font-bold mb-8 text-editorial">The Heart of our Craft</h2>
                <div className="relative bg-white p-10 rounded-2xl shadow-xl">
                  <span
                    className="material-symbols-outlined text-primary text-5xl absolute -top-4 -left-4 bg-white rounded-full">format_quote</span>
                  <p className="text-xl italic text-on-surface-variant leading-relaxed mb-6">
                    "We don't just recycle materials; we build legacies. Our studio in Tunis is a laboratory
                    where heritage meets the future of sustainability."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                    <div>
                      <p className="font-bold">Selim Slimi</p>
                      <p className="text-sm text-on-surface-variant">Founder & CEO, Colibris</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Join the Movement CTA */}
        <section className="py-24 px-8">
          <div
            className="max-w-7xl mx-auto bg-on-background rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-64 h-64 border-2 border-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2">
            </div>
            <div
              className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl">
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-editorial">Ready to design a better
                world?</h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">
                Join our community of visionaries, designers, and conscious consumers. Whether you're looking
                for a partnership or simply want to support the movement, there's a place for you in the
                ecosystem.
              </p>
              <div className="flex-1 items-center gap-4 justify-center flex-wrap flex">

                <Link
                  href="/auth/signup"
                  className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-container transition-all scale-100 hover:scale-105 inline-flex items-center justify-center"
                >
                  Get Involved
                </Link>

                <Link
                  href="/contact"
                  className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center justify-center"
                >
                  Partner with Us
                </Link>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
