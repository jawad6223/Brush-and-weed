import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cities } from "../data/cities";

export default function CityPage() {
  const navigate = useNavigate();
  const { city } = useParams();
  const cityData = cities.find(c => c.slug.toLowerCase() === city?.toLowerCase());

  if (!cityData) return <Navigate to="/" />;

  const handleQuoteClick = () => {
    if (window.location.pathname === "/") {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
    }
  };

  return (
    <>
      {/* SEO Meta */}
      <Helmet>
        <title>
          Brush & Weed Clearing in {cityData.name}, {cityData.state}
        </title>
        <meta
          name="description"
          content={`Professional eco-friendly goat brush and weed clearing services in ${cityData.name}, ${cityData.state}. No chemicals, safe for families and pets.`}
        />
        <link
          rel="canonical"
          href={`https://centraloregongoats.com/${cityData.slug}`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-green-50 min-h-screen flex flex-col justify-center items-center text-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-6">
          Brush & Weed Clearing in {cityData.name}, {cityData.state}
        </h1>
        <p className="text-lg sm:text-xl text-green-800 max-w-2xl mb-8">
          Eco-friendly goat-powered land clearing in {cityData.name}, Oregon. We remove invasive brush and weeds naturally, without chemicals. Safe for families, pets, and the environment.
        </p>
        <a
          onClick={handleQuoteClick}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 cursor-pointer"
        >
          Request a Free Quote
        </a>
      </section>

      {/* Info Cards */}
      <section className="px-4 py-16 max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Eco-Friendly</h2>
          <p className="text-green-800">
            Our goats clear brush naturally. No herbicides, no chemicals, 100% safe for your land.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Efficient</h2>
          <p className="text-green-800">
            Large or small properties, our trained goats quickly and efficiently remove unwanted vegetation.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Sustainable</h2>
          <p className="text-green-800">
            Improve soil health and reduce fire risk naturally while supporting sustainable land management.
          </p>
        </div>
      </section>

      {/* Testimonials / CTA */}
      <section className="bg-green-100 py-16 text-center px-4">
        <h2 className="text-3xl font-bold text-green-900 mb-6">Why Choose Us?</h2>
        <p className="max-w-2xl mx-auto text-green-800 mb-8">
          Trusted by homeowners and businesses across Central Oregon. Safe, chemical-free, and eco-friendly brush clearing that works with nature.
        </p>
        <a
          onClick={handleQuoteClick}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-md shadow-md transition-all duration-300 cursor-pointer"
        >
          Book Your Service Today
        </a>
      </section>
    </>
  );
}
