import { Navbar } from "@/components/Navbar";
import Outlets from "@/components/Outlets";
import { cookies } from "next/headers";

export default async function Home(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const cookieGfLoc = JSON.parse(cookieStore.get("gf_loc")?.value || "{}");

  const body = {
    keyword: searchParams?.q || "",
    ...cookieGfLoc,
  };

  const data = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/outlets`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch(() => []);

  return (
    <div className="overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <div className="relarive mt-28 md:mt-20">
        <Navbar />
      </div>
      <main className="mx-auto max-w-screen-xl py-2 px-4 md:w-[calc(100%_-_64px)] lg:pb-16">
        <Outlets data={data} />
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
