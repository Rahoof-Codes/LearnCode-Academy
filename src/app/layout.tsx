import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../lib/db";
import Navbar from "../components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LearnCode Academy | Master Programming Step-by-Step",
  description: "Learn HTML, CSS, JavaScript, TypeScript, Python, C++, Rust, Flutter, Docker, and DevOps through interactive lessons, quizzes, hands-on coding, and earn verifiable certificates.",
  keywords: ["programming education", "coding courses", "learn web development", "python AI", "learn Rust", "developer dashboard", "certificates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.variable} min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
