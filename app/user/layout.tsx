import { DesktopNavbar } from "@/components/custom/desktop-navbar";
import { Footer } from "@/components/custom/footer";
import MobileNavbar from "@/components/custom/mobile-navbar";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navbar (if needed) */}
      {/* <DesktopNavbar /> */}

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Mobile Navbar stays at the bottom */}
      <MobileNavbar />
      <Footer />
    </div>
  );
}
