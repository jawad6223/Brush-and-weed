import { useState, useEffect } from 'react';
import { Leaf, CheckCircle, MapPin, Phone, Mail, Menu, X, Shield, Clock, Signal, Flame } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase, SiteSection, SiteFeature, SiteStep } from '../lib/supabase';
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sections, setSections] = useState<Record<string, SiteSection>>({});
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<SiteStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    acres: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [sectionsRes, featuresRes, stepsRes] = await Promise.all([
      supabase.from('site_sections').select('*'),
      supabase.from('site_features').select('*').order('order_index'),
      supabase.from('site_steps').select('*').eq('section', 'how-it-works').order('order_index'),
    ]);

    if (sectionsRes.data) {
      const sectionsMap: Record<string, SiteSection> = {};
      sectionsRes.data.forEach((section) => {
        sectionsMap[section.section_key] = section;
      });
      setSections(sectionsMap);
    }

    if (featuresRes.data) setFeatures(featuresRes.data);
    if (stepsRes.data) setHowItWorksSteps(stepsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Thank you! Your quote request has been submitted. We will contact you within 24-48 hours.');
        setFormData({ name: '', email: '', phone: '', address: '', acres: '', message: '' });
      } else {
        alert('There was an issue submitting your request. Please try again or call us directly at (541) 555-GOAT.');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('There was an issue submitting your request. Please try again or call us directly at (541) 555-GOAT.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.hash === "#contact") {
      setTimeout(() => {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [location]);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-7 w-7 text-white" /> : <Leaf className="h-7 w-7 text-white" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const hero = sections['hero'] || {};
  const about = sections['about'] || {};
  const benefits = sections['benefits'] || {};

  const colorClasses = [
    { bg: 'from-green-50 to-emerald-50', icon: 'bg-green-800' },
    { bg: 'from-amber-50 to-yellow-50', icon: 'bg-amber-700' },
    { bg: 'from-stone-50 to-amber-50', icon: 'bg-stone-700' },
    { bg: 'from-emerald-50 to-teal-50', icon: 'bg-emerald-700' },
    { bg: 'from-lime-50 to-green-50', icon: 'bg-lime-700' },
    { bg: 'from-yellow-50 to-amber-50', icon: 'bg-yellow-700' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/"><img src="/central_oregon_logo_new_design_(1)_(2) copy.png" alt="Central Oregon Brush & Weed Eaters" className="h-20" /></a>

            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-green-800 transition">Services</button>
              <button onClick={() => scrollToSection('fire-management')} className="text-gray-700 hover:text-green-800 transition">Fire Management</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-green-800 transition">How It Works</button>
              <button onClick={() => scrollToSection('benefits')} className="text-gray-700 hover:text-green-800 transition">Benefits</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-green-800 transition">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-900 transition">Get Quote</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <button onClick={() => scrollToSection('services')} className="block w-full text-left text-gray-700 hover:text-green-800 transition">Services</button>
              <button onClick={() => scrollToSection('fire-management')} className="block w-full text-left text-gray-700 hover:text-green-800 transition">Fire Management</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-gray-700 hover:text-green-800 transition">How It Works</button>
              <button onClick={() => scrollToSection('benefits')} className="block w-full text-left text-gray-700 hover:text-green-800 transition">Benefits</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-gray-700 hover:text-green-800 transition">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-900 transition text-center">Get Quote</button>
            </div>
          )}
        </nav>
      </header>

      <main>
        <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-32 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-green-800 text-amber-50 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  100% Organic • Chemical-Free Land Clearing
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  {hero.title || 'Your Natural Solution for Land Management'}
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  {hero.subtitle || 'Professional eco-friendly goat clearing services'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => scrollToSection('contact')} className="bg-green-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-900 transition shadow-lg hover:shadow-xl">
                    {hero.cta_text || 'Get Free Quote'}
                  </button>
                  <button onClick={() => scrollToSection('how-it-works')} className="bg-white text-green-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-stone-50 transition border-2 border-green-800">
                    {hero.cta_secondary_text || 'Learn More'}
                  </button>
                </div>
              </div>
              <div className="relative">
                {hero.image_url && (
                  <img
                    src={hero.image_url}
                    alt="Goats grazing and clearing brush"
                    className="rounded-2xl shadow-2xl"
                  />
                )}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border-2 border-amber-100">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-10 w-10 text-green-800" />
                    <div>
                      <p className="font-bold text-2xl text-gray-900">100%</p>
                      <p className="text-sm text-gray-600">Chemical-Free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{about.title || 'Why Choose Goat Clearing?'}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {about.description || 'Our organic approach provides superior results'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const colors = colorClasses[index % colorClasses.length];
                return (
                  <div key={feature.id} className={`bg-gradient-to-br ${colors.bg} p-8 rounded-2xl hover:shadow-lg transition`}>
                    <div className={`${colors.icon} w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
                      {getIcon(feature.icon_name)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="fire-management" className="py-20 bg-gradient-to-br from-green-900 to-green-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-6">How Goats Help Reduce Fire Risk</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Flame className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Remove Fuel Sources</h4>
                        <p className="text-green-100">Goats consume dry brush, tall grasses, and invasive vegetation that acts as wildfire fuel</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Flame className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Create Defensible Space</h4>
                        <p className="text-green-100">Establish natural firebreaks around your property, buildings, and access roads</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Flame className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Year-Round Protection</h4>
                        <p className="text-green-100">Regular grazing maintains low fuel loads before fire season arrives</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Flame className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Safer Than Burning</h4>
                        <p className="text-green-100">No smoke, no permits required, and no risk of escaped controlled burns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold mb-6">Wildfire Mitigation Through Natural Grazing</h2>
                <p className="text-xl text-green-100 mb-6">
                  In Central Oregon's fire-prone landscape, proactive vegetation management is essential. Our goat clearing services provide an effective, eco-friendly solution for reducing wildfire risk on your property.
                </p>
                <p className="text-lg text-green-100 mb-8">
                  Fire departments and forestry experts increasingly recommend targeted grazing as a proven fire prevention strategy. Goats can access steep terrain and sensitive areas where machinery can't operate, making them ideal for comprehensive fuel reduction.
                </p>
                <div className="bg-amber-500 text-gray-900 rounded-xl p-6">
                  <h4 className="font-bold text-xl mb-2">Protect Your Investment</h4>
                  <p className="text-lg">
                    Properties with reduced fuel loads have significantly better outcomes during wildfires. Some insurance providers may offer discounts for documented fire mitigation efforts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gradient-to-br from-stone-50 to-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our simple process from assessment to completion
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {howItWorksSteps.map((step) => (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                    {step.step_number}
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm flex-1 border border-amber-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mt-12 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <Signal className="h-8 w-8 text-amber-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Service Requirement: Cell Coverage</h3>
                  <p className="text-gray-700 text-lg">
                    Our GPS fence system requires a minimum of 2 bars of cell phone service throughout your property to function properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{benefits.title || 'The Organic Advantage'}</h2>
                <p className="text-xl text-gray-600 mb-8">
                  {benefits.description || 'Superior land clearing that improves your property'}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                    <p className="text-gray-700"><strong>No Glyphosate Exposure:</strong> Protect your family and pets from toxic herbicides</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                    <p className="text-gray-700"><strong>Wildlife Safe:</strong> Native animals can safely inhabit your land</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                    <p className="text-gray-700"><strong>Carbon Negative:</strong> No fossil fuels, just natural grazing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                    <p className="text-gray-700"><strong>Soil Improvement:</strong> Natural fertilization builds healthier land</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                    <p className="text-gray-700"><strong>Property Friendly:</strong> No machinery damage or disruption</p>
                  </div>
                </div>
              </div>
              {benefits.image_url && (
                <img
                  src={benefits.image_url}
                  alt="Happy goats clearing land"
                  className="rounded-2xl shadow-xl"
                />
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Serving Central Oregon</h2>
              <p className="text-xl mb-8 text-green-100">
                From Bend to Madras, Sisters to Prineville, we provide eco-friendly land management solutions throughout Central Oregon.
              </p>
              <button onClick={() => scrollToSection('contact')} className="bg-amber-400 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-300 transition shadow-lg">
                Schedule Your Free Assessment
              </button>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  How long does it take to clear my property?
                </summary>
                <p className="mt-4 text-gray-600">
                  Timeline varies based on property size, vegetation density, and herd size. Typically, 1-2 acres of moderate brush takes 1-2 weeks.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  Will the goats damage my property?
                </summary>
                <p className="mt-4 text-gray-600">
                  No. Unlike heavy machinery, goats leave no tire tracks or soil compaction. The GPS system keeps them exactly where you want them.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  What if my property doesn't have good cell coverage?
                </summary>
                <p className="mt-4 text-gray-600">
                  Our GPS fence system requires a minimum of 2 bars of cell service. We test coverage during our initial assessment.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  What types of vegetation do goats eat?
                </summary>
                <p className="mt-4 text-gray-600">
                  Goats excel at clearing brush, blackberries, poison oak, thistle, scotch broom, and most invasive species.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  Is this safe for my pets and children?
                </summary>
                <p className="mt-4 text-gray-600">
                  Absolutely. No chemicals, no hot wires, and friendly goats make our service completely safe.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                  How much does goat clearing cost?
                </summary>
                <p className="mt-4 text-gray-600">
                  Pricing varies based on acreage, vegetation density, and terrain. We provide free on-site assessments and custom quotes.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Transform Your Land?</h2>
                <p className="text-xl text-gray-600">
                  Get a free property assessment and custom quote
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                      Property Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition"
                      placeholder="123 Main St, Bend, OR"
                    />
                  </div>

                  <div>
                    <label htmlFor="acres" className="block text-sm font-semibold text-gray-900 mb-2">
                      Approximate Acreage (minimum 1 acre)
                    </label>
                    <input
                      type="text"
                      id="acres"
                      value={formData.acres}
                      onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition"
                      placeholder="2-3 acres"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-800 focus:outline-none transition resize-none"
                      placeholder="Tell us about your land clearing needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-900 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Free Assessment'}
                  </button>
                </form>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Phone className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Phone</p>
                          <p className="text-gray-600">(541) 316-8716</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <p className="text-gray-600">centraloregonweedeaters@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-green-800 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Service Area</p>
                          <p className="text-gray-600">Central Oregon: Bend, Redmond, Sisters, Terrebonne, Prineville, Madras and surrounding areas.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-gray-900 mb-3">What to Expect</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-800 flex-shrink-0 mt-0.5" />
                        <span>Free on-site property assessment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-800 flex-shrink-0 mt-0.5" />
                        <span>Cell coverage verification</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-800 flex-shrink-0 mt-0.5" />
                        <span>Custom project timeline & quote</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-800 flex-shrink-0 mt-0.5" />
                        <span>Response within 24-48 hours</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <Signal className="h-8 w-8 text-amber-700 mb-3" />
                    <p className="text-gray-700">
                      <strong>Remember:</strong> Your property must have at least 2 bars of cell coverage for our GPS system.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                    <p className="text-gray-700">
                      <strong>Minimum Service Area:</strong> We require a minimum of 1 acre for our goat clearing services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/central_oregon_logo_new_design_(1)_(2) copy.png" alt="Central Oregon Brush & Weed Eaters" className="h-12 mb-4" />
              <p className="text-gray-400">
                Eco-friendly land clearing solutions powered by nature and technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Services</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">How It Works</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="hover:text-white transition">Benefits</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-white transition">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Service Area</h4>
              <p className="text-gray-400 mb-4">
                Proudly serving Central Oregon including Bend, Redmond, Sisters, Prineville, and surrounding communities.
              </p>
              <p className="text-gray-400 text-sm">
                100% Organic • Chemical-Free • GPS Managed
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Central Oregon Brush and Weed Eaters. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Clock className="fixed bottom-4 right-4 opacity-0 h-0 w-0" />
    </div>
  );
}
