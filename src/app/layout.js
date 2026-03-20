import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Furrever",
  description: "The place where love meets pet essentials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          className="sized-toaster"
          toastOptions={{
            style: {
              background: "#355E3B",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
