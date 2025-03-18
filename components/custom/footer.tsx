import Link from "next/link";

          {/* <nav className="flex space-x-6">
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact Us
            </Link>
          </nav> */}


export function Footer() {
  return (
    <footer className="border-t border-gray-300 py-5 w-full mt-auto hidden md:block">
      <div className="container mx-auto px-6 lg:px-8 text-gray-600">
        <div className="flex justify-between items-center">
          <p className="text-sm">© 2025 S. All rights reserved.</p>
          <p>
            Developed & Design by{" "}
            <Link
              href="https://santoshmarar.com"
              className="hover:text-gray-900 transition"
              
            >
              Santosh Marar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}



