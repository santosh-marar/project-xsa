// export const metadata: Metadata = {
//   title: "Shozens.com - User Profile Page",
//   description: "Welcome to Shozens.com - Your profile Page",
// };

import { DesktopNavbar } from "@/components/custom/desktop-navbar";
import MobileNavbar from "@/components/custom/mobile-navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <DesktopNavbar /> */}
      {children}
      <MobileNavbar />
    </>
  );
}
