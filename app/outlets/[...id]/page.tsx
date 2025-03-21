import Image from "next/image";
import Products from "@/components/Products";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id } = await params;

  if (!id || id.length < 3) {
    return redirect("/outlets");
  }

  const [area, goId, grabId] = id;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/outlets/${grabId}/en/${area}/restaurant/${goId}`
  )
    .then((res) => res.json())
    .catch(() => {
      return redirect("/outlets");
    });

  if (data.error || !data.name) {
    return redirect("/outlets");
  }

  return (
    <div className="pt-8">
      <div className="relative flex flex-col md:flex-row gap-4 items-center space-x-4">
        <div className="relative h-full shrink-0 overflow-hidden rounded-xl">
          <Image
            alt={data.name}
            src={data.photoHref}
            height={200}
            width={200}
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-row items-center gap-2 flex-grow overflow-x-hidden">
          <div className="flex flex-col max-w-[calc(100%-32px)]">
            <div className="whitespace-nowrap">
              <h1 className="overflow-ellipsis text-xl md:text-3xl font-bold">
                {data.name}
              </h1>
            </div>
            <div className="mb-3 flex flex-col space-y-3 overflow-auto">
              <p className="text-gray-500 line-clamp-l">{data.cuisine}</p>
              <p className="text-gray-700 line-clamp-l">{data.address}</p>
            </div>
          </div>
        </div>
      </div>

      <Products data={data} />
    </div>
  );
}
