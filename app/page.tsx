import { Footer } from "@/components/custom/footer";
import { Header } from "@/components/custom/header";
import { HomeCarousel } from "@/components/custom/home-carousel";
import MobileNavbar from "@/components/custom/mobile-navbar";
import { ProductCard } from "@/components/custom/product-card";

export default function Page() {
  const products = [
    {
      id: "1",
      title: "Colorful T-Shirts",
      price: 700,
      originalPrice: 900,
      rating: 4.5,
      reviews: 1771,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-07%2007-27-23-uvtZmtXk1IzpasKsTixH5W2LsJW1L3.png",
    },
    {
      id: "2",
      title: "Classic White Tee",
      price: 500,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-07%2007-27-23-uvtZmtXk1IzpasKsTixH5W2LsJW1L3.png",
    },
    {
      id: "3",
      title: "Premium Black Shirt",
      price: 800,
      originalPrice: 1000,
      rating: 4.8,
      reviews: 2103,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-07%2007-27-23-uvtZmtXk1IzpasKsTixH5W2LsJW1L3.png",
    },
    {
      id: "4",
      title: "Vibrant Red Top",
      price: 600,
      rating: 4.2,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-07%2007-27-23-uvtZmtXk1IzpasKsTixH5W2LsJW1L3.png",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-14">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Featured Section */}
          <section className="mb-12">
            <HomeCarousel />
          </section>

          {/* Product Grid */}
          <section>
            {/* <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <button className="text-sm font-medium text-gray-600 transition-colors hover:text-black">
              View all
            </button>
          </div> */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <div key={product.id} className="max-w-[250px] mx-auto w-full">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </section>
        </main>
        <MobileNavbar />
      </div>
      <Footer />
    </>
  );
}
