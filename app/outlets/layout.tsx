import { Navbar } from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <div className="relative mt-28 md:mt-20">
        <Navbar />
      </div>
      <main className="mx-auto max-w-screen-xl py-2 px-4 md:w-[calc(100%_-_64px)] lg:pb-16">
        {children}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          href="https://www.linkedin.com/in/arifrudianto/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center text-gray-500 p-4"
        >
          made with ☕ by @arifrdianto
        </a>
      </footer>
    </div>
  );
}
