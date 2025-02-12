import { DesktopNavbar } from "@/components/custom/desktop-navbar";
import { Footer } from "@/components/custom/footer";
import { HomeCarousel } from "@/components/custom/home-carousel";
import MobileNavbar from "@/components/custom/mobile-navbar";
import { ProductCard } from "@/components/custom/product/product-card";

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-14">
        <DesktopNavbar />

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
            {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <div key={product.id} className="max-w-[248px] mx-auto w-full">
                  <ProductCard {...product} />
                </div>
              ))}
            </div> */}
          </section>
        </main>
        <MobileNavbar />
      </div>
      <Footer />
    </>
  );
}
