import { DesktopNavbar } from "@/components/custom/desktop-navbar";
import { Footer } from "@/components/custom/footer";
import { HomeCarousel } from "@/components/custom/home-carousel";
import MobileNavbar from "@/components/custom/mobile-navbar";
import HomeProduct from "@/components/custom/product/home-product";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="">
        <DesktopNavbar />

        <main className="container mx-auto p-4 md:p-8">
          {/* Featured Section */}
          <section className="mb-12"><HomeCarousel /></section>

          {/* Product Grid */}
          <section>
            {/* <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <button className="text-sm font-medium text-gray-600 transition-colors hover:text-black">
              View all
            </button>
          </div> */}
            <HomeProduct />
          </section>
        </main>
        <MobileNavbar />
      </div>
      <Footer />
    </div>
  );
}
