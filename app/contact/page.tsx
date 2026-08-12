'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react';
import { utilService } from '@/services/utilService';

export default function ContactPage() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSending(true);
      setError("");
      setSuccess("");
      console.log("Sending payload:", formData);

      await utilService.sendContactMail(formData);

      setSuccess("Your message has been sent successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.error(err);
      setError(
        "Failed to send your message. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-8 md:px-16 bg-surface">
        {/* Hero Section */}
        <header className="relative overflow-hidden rounded-[32px] bg-surface-container-low min-h-[620px] flex items-center px-6 md:px-12 lg:px-20 py-24 mt-8">

          {/* Decorative Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />

            <img
              src="/logo_horizontal_+_tagline_rvb.png"
              alt="Background Logo"
              className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[85%]
                max-w-5xl
                opacity-[0.45]
                object-contain
              "
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl">
            <Badge variant="primary" className="mb-8">
              CONNECT WITH THE GALLERY
            </Badge>

            <h1 className="text-5xl md:text-6xl font-black leading-[0.95] text-on-surface mb-8">
              How can we help you cultivate change?
            </h1>

            <p className="text-lg md:text-xl text-on-surface/70 leading-relaxed max-w-2xl">
              Whether you're looking to integrate biophilic design into your
              space or seeking professional ecological consultation, our team is
              ready to branch out with you.
            </p>
          </div>
        </header>

        {/* Support Grid */}
        <section className="relative z-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 -mt-20 px-2 mb-40">
          {[
            {
              title: "Direct Support",
              icon: "support_agent",
              email: "contact@colibris.tn",
              phone: "(+216) 58 330 734",
            },
            {
              title: "Community Hub",
              icon: "groups",
              desc: "Join our WhatsApp circle for daily inspiration.",
            },
            {
              title: "Business",
              icon: "business_center",
              desc: "Partnerships and gallery placements.",
            },
            {
              title: "Studio Tour",
              icon: "location_on",
              desc: "Experience the ecosystem in Mghira.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="
                bg-white/80
                backdrop-blur-xl
                border border-white/30
                p-8
                rounded-[28px]
                shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              "
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined text-3xl">
                  {item.icon}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-on-surface mb-4">
                {item.title}
              </h3>

              {item.email && (
                <div className="space-y-2">
                  <a
                    href={`mailto:${item.email}`}
                    className="block text-lg font-bold text-primary hover:opacity-80"
                  >
                    {item.email}
                  </a>

                  <p className="text-on-surface/60">
                    {item.phone}
                  </p>
                </div>
              )}

              {item.desc && (
                <p className="text-on-surface/60 leading-relaxed text-lg">
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Contact Form Section */}
        <section className="flex flex-col lg:flex-row gap-20 mb-40 items-stretch">
          <div className="lg:w-2/5 space-y-12">
            <h2 className="text-headline-lg text-on-surface leading-tight">Start a conversation with our architects of nature.</h2>
            <div className="relative rounded-sm overflow-hidden aspect-video shadow-soft bg-surface-container-highest">
              <iframe
                title="El Mghira Map"
                className="h-full w-full opacity-80"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=36.720684,10.1563204&z=14&output=embed"
              />
            </div>
            <div className="bg-surface-container-low p-10 rounded-sm">
              <h4 className="text-title-lg text-on-surface mb-6 font-bold uppercase tracking-widest text-xs opacity-50">Our Tunisia Studio</h4>
              <p className="text-body-lg text-on-surface/70 leading-relaxed">
                Cité Hached. Mghira Inzel.<br />
                1095 Tunis,<br />
                Tunisia
              </p>
            </div>
          </div>

          <div className="lg:w-3/5 bg-surface-container-low p-10 md:p-20 rounded-md shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-12">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                <div className="space-y-3">
                  <label
                    className="text-label-md font-black uppercase tracking-widest text-on-surface/40"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none"
                  />
                </div>


                <div className="space-y-3">
                  <label
                    className="text-label-md font-black uppercase tracking-widest text-on-surface/40"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none"
                  />
                </div>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-label-md font-black uppercase tracking-widest text-on-surface/40" htmlFor="email">Email Address</label>
                  <input
                    className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label
                    className="text-label-md font-black uppercase tracking-widest text-on-surface/40"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <label
                className="text-label-md font-black uppercase tracking-widest text-on-surface/40"
                htmlFor="subject"
              >
                Subject
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none appearance-none"
              >
                <option value="">
                  Select subject
                </option>

                <option value="Biophilic Consultation">
                  Biophilic Consultation
                </option>

                <option value="Refill Station Orders">
                  Refill Station Orders
                </option>

                <option value="Gallery Partnership">
                  Gallery Partnership
                </option>
              </select>
              <div className="space-y-3">
                <label className="text-label-md font-black uppercase tracking-widest text-on-surface/40" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-surface-container-high border-none px-6 py-4 text-body-lg rounded-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary outline-none resize-none"
                />
              </div>
              {success && (
                <p className="text-primary font-bold">
                  {success}
                </p>
              )}

              {error && (
                <p className="text-red-500 font-bold">
                  {error}
                </p>
              )}
              <button
                disabled={sending}
                className="w-full md:w-auto bg-primary text-on-primary px-16 py-5 rounded-full font-bold text-title-lg shadow-soft hover:shadow-[0_0_20px_rgba(0,167,117,0.4)] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-60"
                type="submit"
              >
                {sending ? "Sending..." : "Send Message"}

                <span className="material-symbols-outlined">
                  send
                </span>
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-40">
          <div className="text-center mb-20">
            <h2 className="text-headline-lg text-on-surface mb-6">Curated Answers</h2>
            <p className="text-body-lg text-on-surface/60">Common inquiries from our ecosystem participants.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "How does waste collection work with Colibris?",
                a: "Colibris organizes door-to-door collection of recyclable waste for households and businesses. You can schedule a pickup through our platform, and our teams will collect your recyclable waste at the agreed time. The waste is then sorted and sent to appropriate recycling facilities.",
              },
              {
                q: "What types of waste are accepted?",
                a: "We collect recyclable materials such as paper, cardboard, plastic, glass, and metals. Please visit our 'Recyclable Waste' section for a complete list and instructions on how to prepare your waste before collection.",
              },
              {
                q: "How can I book a collection?",
                a: "You can book a collection directly through our website or via our mobile application (coming soon). Simply log into your account, choose a date and time, and confirm your appointment. You will receive a confirmation email.",
              },
              {
                q: "What are the benefits of the Colibris online store?",
                a: "Our online store offers eco-friendly products from committed partners. Every purchase supports sustainable initiatives, and delivery is carried out during your waste collection, helping reduce our carbon footprint.",
              },
              {
                q: "What should I do if I have a problem with my order or collection?",
                a: "For any issue, contact our team through the contact form on the 'Contact Us' page or by phone at (+216) 58 330 734. We will respond as quickly as possible to help resolve your concern.",
              },
              {
                q: "How can I track the status of my collection?",
                a: "Once your appointment is confirmed, you will receive notifications by email or through our mobile application (coming soon) to track your collection status in real time.",
              },
              {
                q: "Is Colibris available in my area?",
                a: "Currently, our services are available in Tunis and selected surrounding areas. Contact us to check whether your address is covered or to request an extension of our services.",
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-container-lowest rounded-md shadow-soft overflow-hidden">
                <summary className="flex justify-between items-center p-8 cursor-pointer list-none">
                  <h4 className="text-title-lg text-on-surface">{faq.q}</h4>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-primary text-3xl">expand_more</span>
                </summary>
                <div className="px-8 pb-8 text-body-lg text-on-surface/60 leading-relaxed bg-surface-container-low pt-8">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
