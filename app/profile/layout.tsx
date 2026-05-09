import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Tijaro | Profile",
  description: "kurier profile page",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${nunitoSans.variable} antialiased`}>{children}</div>;
}
