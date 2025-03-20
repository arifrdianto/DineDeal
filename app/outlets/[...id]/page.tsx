import { formatThousandSeparator } from "@/utils/string";
import { Star } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
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
  ).then((res) => res.json());

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
      <div className="grid grid-cols-2 gap-4 mt-8">
        {data.menus.map((menu) => (
          <div key={menu.provider}>
            <div className="overflow-x-auto bg-gray-100 py-2 px-3">
              <div className="flex h-8 space-x-4 items-center [&_div]:border-r-gray-300 [&_>_div]:border-r [&_>_div:last-child]:border-none">
                <Image
                  src={menu.providerImageSrc}
                  alt={menu.provider}
                  width={94}
                  height={50}
                />
                <div className="flex items-center h-full">
                  <Star
                    fill="#ffdf20"
                    strokeWidth={0}
                    size={16}
                    className="mr-1.5"
                  />
                  <span className="text-sm">{menu.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {menu.categories.map((category, i) => (
                <div
                  key={category.id + "-" + i}
                  className="flex flex-col space-y-4"
                >
                  <h2 className="mt-6 mb-2 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mb-2">
                    {category.products.map((product, j) => {
                      return (
                        <div
                          key={product.id + "-" + j}
                          className="border border-gray-300 p-3 rounded-xl"
                        >
                          <div className="flex w-full items-stretch justify-between">
                            <div className="mt-1 ml-1 mr-4 flex w-full flex-col">
                              <h3 className="line-clamp-2 font-semibold mb-1">
                                {product.name}
                              </h3>
                              <p className="line-clamp-1 text-gray-500 text-sm text-pretty">
                                {product.description}
                              </p>
                              <div className="flex mt-4 items-center space-x-2">
                                {product.isPromo && (
                                  <span className="text-gray-700 text-sm line-through">
                                    {formatThousandSeparator(product.price)}
                                  </span>
                                )}
                                <span className="text-sm">
                                  {formatThousandSeparator(
                                    product.priceDiscounted
                                  )}
                                </span>
                                {product.isPromo && (
                                  <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">
                                    Promo
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="relative h-[112px] w-[112px] flex-shrink-0 lg:h-[120px] lg:w-[120px]">
                              <Image
                                className="h-full w-full rounded-xl object-cover"
                                src={product.imgSrc}
                                alt={product.name}
                                width={120}
                                height={120}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
