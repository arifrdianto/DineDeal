"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { checkGeolocationPermission } from "@/utils/geolocation";
import Outlet from "./Outlet";

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
    (async () => {
      const location = await checkGeolocationPermission();

      if ("coords" in location) {
        setCoordinate({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        });
      } else {
        alert(`Error getting location: ${location.message}`);
      }
    })();
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

  if (!Array.isArray(searchMerchants)) {
    return (
      <div className="flex justify-center mt-4">
        <p className="text-lg font-bold">
          An error occurred while fetching outlets.
        </p>
      </div>
    );
  }

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

      {loading && Array.isArray(searchMerchants) ? (
        <div className="flex justify-center mt-4">
          <p className="text-lg font-bold">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 mt-6 md:mt-10 mb-8 mx-0">
          {searchMerchants.map((merchant) => (
            <Outlet key={merchant.id} merchant={merchant} />
          ))}
        </div>
      )}
    </div>
  );
}
