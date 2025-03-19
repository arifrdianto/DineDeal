"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, Star, X } from "lucide-react";
import { getCurrentLocation } from "@/utils/geolocation";

type Outlet = {
  id: string;
  provider: string;
  providerImageSrc: string;
  imageSrc: string;
  imageSrcFallback: string;
  name: string;
  cuisine: string;
  rating?: number;
  distance: string;
  priceTag: number;
};

type OutletsProps = {
  data: Outlet[];
};

export default function Outlets({ data }: OutletsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isFirstRender = useRef(true);

  const [input, setInput] = useState(searchParams.get("q") || "");
  const [keyword, setKeyword] = useState("");
  const [searchMerchants, setSearchMerchants] = useState(data);
  const [loading, setLoading] = useState(false);
  const [coordinate, setCoordinate] = useState({ lat: 0, long: 0 });

  useEffect(() => {
    getCurrentLocation().then((location) => {
      setCoordinate(location);
    });
  }, []);

  useEffect(() => {
    if (!coordinate.lat || !coordinate.long) return;

    fetch("/api/location/reverse", {
      method: "POST",
      body: JSON.stringify({
        lat: coordinate.lat,
        long: coordinate.long,
      }),
    });
  }, [coordinate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.length < 3) return;

      setKeyword(input);
      const newParams = new URLSearchParams(searchParams.toString());
      if (input) {
        newParams.set("q", input);
      } else {
        newParams.delete("q");
      }

      router.push(`${pathname}?${newParams.toString()}`, { scroll: false }); // Update URL tanpa reload
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setLoading(true);
    fetch("/api/outlets", {
      method: "POST",
      body: JSON.stringify({
        keyword: keyword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSearchMerchants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="mt-8">
      <div className="w-full group relative flex items-stretch overflow-hidden rounded-full border border-gray-300 transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600">
        <div className="absolute left-0 flex h-full shrink-0 items-center px-3">
          <Search className="text-gray-400" />
        </div>

        <input
          type="text"
          placeholder="Search restaurant"
          className="pl-11 pr-11 py-[9px] bg-transparent block grow outline-none min-w-0 placeholder:text-content-muted"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={input}
          onBlur={() => keyword && setInput(keyword)}
        />
        {input && (
          <div
            role="button"
            onClick={() => {
              setInput("");
              setKeyword("");
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.delete("q");
              router.push(`${pathname}?${newParams.toString()}`, {
                scroll: false,
              });
            }}
            className="absolute right-0 flex h-full shrink-0 items-center px-3"
          >
            <X className="text-gray-400" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center mt-4">
          <p className="text-lg font-bold">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6 mt-6 md:mt-10 mb-8 mx-4 md:mx-0">
          {searchMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="border border-gray-300 hover:border-emerald-600 transition-all duration-300 ease-in-out rounded-xl hover:md:shadow-xl"
            >
              <div className="bg-white rounded-2xl flex cursor-pointer py-4 pl-6 pr-0 lg:h-auto lg:w-full lg:flex-col lg:p-2 md:min-h-[168px] md:!rounded-2xl md:p-1.5 md:pr-6 relative after:absolute after:left-0 after:bottom-0 after:block after:w-full after:h-px after:bg-background-border-secondary md:after:hidden last-of-type:after:hidden">
                <div
                  className={`bg-gradient-to-r flex h-[26px] w-max items-center whitespace-nowrap px-3 py-1 text-xs rounded-r-3xl rounded-tl-3xl ${
                    merchant.provider.toUpperCase() === "GRABFOOD"
                      ? "from-emerald-100"
                      : "from-red-100"
                  } to-white absolute -left-1 top-4 z-10`}
                >
                  <div
                    className={`absolute left-0 top-[100%] h-1 w-1 ${
                      merchant.provider.toUpperCase() === "GRABFOOD"
                        ? "bg-emerald-200"
                        : "bg-red-200"
                    }`}
                    style={{
                      clipPath: "polygon(0px 0px, 100% 0px, 100% 100%)",
                    }}
                  ></div>
                  <Image
                    src={merchant.providerImageSrc}
                    alt={merchant.provider}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="relative min-h-[114px] w-[126px] shrink-0 grow-0 overflow-hidden lg:h-[155px] lg:w-full">
                  <div className="h-full w-full overflow-hidden rounded-lg relative">
                    <Image
                      src={merchant.imageSrc || merchant.imageSrcFallback}
                      className="overflow-hidden rounded-lg object-cover"
                      width={280}
                      height={280}
                      alt={merchant.name}
                    />
                  </div>
                </div>
                <div className="h-full w-full py-2 pl-3 pr-4 text-content-primary md:py-3 lg:px-2">
                  <p className="mb-2 line-clamp-2 label-m">{merchant.name}</p>
                  <p className="mb-2 text-gray-500 line-clamp-1 text-xs md:mb-4 lg:body-s">
                    {merchant.cuisine}
                  </p>
                  <div className="flex max-w-[220px] items-center justify-start space-x-3 text-sm">
                    {merchant.rating ? (
                      <>
                        <div className="flex items-center">
                          <Star
                            fill="#ffdf20"
                            strokeWidth={0}
                            size={16}
                            className="mr-1.5"
                          />

                          <span className="text-sm">{merchant.rating}</span>
                        </div>
                        <span className="h-1 w-1 rounded-full bg-black"></span>
                      </>
                    ) : null}
                    <div className="flex items-center">
                      <MapPin
                        fill="#fb2c36"
                        color="#fff"
                        strokeWidth={1.5}
                        size={16}
                        className="mr-1"
                      />
                      <span>{merchant.distance}</span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-black"></span>
                    <div className="flex items-center">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < merchant.priceTag
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          $
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
