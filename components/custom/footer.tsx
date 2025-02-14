import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

// export function Footer() {
//   return (
//     <footer className="hidden md:block bg-gray-100 pt-6 pb-0">
//       {/* <div className="container mx-auto px-4"> */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="font-bold text-lg mb-4">Shop</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   New Arrivals
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Best Sellers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Sale
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   All Collections
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-bold text-lg mb-4">Customer Service</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Shipping & Returns
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   FAQ
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Size Guide
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-bold text-lg mb-4">About Us</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Our Story
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Careers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Sustainability
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#" className="text-gray-600 hover:text-black">
//                   Press
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-bold text-lg mb-4">Follow Us</h3>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-600 hover:text-black">
//                 <Facebook className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-black">
//                 <Twitter className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-black">
//                 <Instagram className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-black">
//                 <Youtube className="w-6 h-6" />
//               </a>
//             </div>
//             <div className="mt-4">
//               <h4 className="font-semibold mb-2">
//                 Subscribe to our newsletter
//               </h4>
//               <form className="flex">
//                 <input
//                   type="email"
//                   placeholder="Your email"
//                   className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-sm font-medium text-white bg-black rounded-r-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div> */}
//         {/* <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm"> */}
//           © 2025 YourBrand. All rights reserved.
//         {/* </div> */}
//       {/* </div> */}
//     </footer>
//   );
// }

export function Footer() {
  return (
    <footer className="bg-gray-100 py-4 hidden md:block">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 text-sm">
          © 2025 S. All rights reserved.
          <br />
          <Link href="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}
