import { Navbar } from "./_components/Navbar";

export default function MarketingLayout({ children }) {
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
}
