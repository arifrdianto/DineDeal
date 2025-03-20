"use client";

import { Menu } from "@/app/types/outlet";
import { formatThousandSeparator } from "@/utils/string";
import { Search, Star, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Products({ data }: { data: { menus: Menu[] } }) {
  const [filtered, setFiltered] = useState(data.menus);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      doFilter(inputValue);
    }
  };

  const doFilter = (value: string) => {
    if (value === "") {
      setFiltered(data.menus);
      return;
    }
    const filter = data.menus
      .map((provider) => ({
        ...provider,
        categories: provider.categories
          .map((category) => ({
            ...category,
            products: category.products.filter((product) =>
              product.name.toLowerCase().includes(inputValue.toLowerCase())
            ),
          }))
          .filter((category) => category.products.length > 0),
      }))
      .filter((provider) => provider.categories.length > 0);

    setFiltered(filter);
  };

  return (
    <div>
      <div className="w-full group relative mt-8 flex items-stretch overflow-hidden rounded-full border border-gray-300 transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600">
        <div className="absolute left-0 flex h-full shrink-0 items-center px-3">
          <Search className="text-gray-400" />
        </div>

        <input
          type="text"
          placeholder="Search menu"
          className="pl-11 pr-11 py-[9px] bg-transparent block grow outline-none min-w-0 placeholder:text-content-muted"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
        {inputValue && (
          <div
            role="button"
            onClick={() => {
              doFilter("");
              setInputValue("");
            }}
            className="absolute right-0 flex h-full shrink-0 items-center px-3"
          >
            <X className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {filtered.map((menu: Menu) => (
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
