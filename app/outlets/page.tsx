import Outlets from "@/components/Outlets";
import { cookies } from "next/headers";

export default async function Page(props: {
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
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Outlets data={data} />
    </div>
  );
}
