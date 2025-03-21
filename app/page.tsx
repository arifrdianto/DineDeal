"use client";

import { checkGeolocationPermission } from "@/utils/geolocation";
import { MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [coordinate, setCoordinate] = useState({ lat: 0, long: 0 });
  const [location, setLocation] = useState({ name: "" });

  useEffect(() => {
    async function fetchData() {
      await check();
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!coordinate.lat || !coordinate.long) return;

    fetch("/api/location/reverse", {
      method: "POST",
      body: JSON.stringify({
        lat: coordinate.lat,
        long: coordinate.long,
      }),
    })
      .then((res) => res.json())
      .then((data) => setLocation(data));
  }, [coordinate]);

  const check = async () => {
    const location = await checkGeolocationPermission();

    if ("coords" in location) {
      setCoordinate({
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
    } else {
      alert(`Error getting location: ${location.message}`);
    }
  };

  return (
    <div className="bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {location.name ? (
            <div className="flex flex-col items-center justify-center space-y-3 text-left md:flex-row md:space-x-4 md:space-y-0">
              <div className="items-center justify-between w-full md:flex md:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                    <span className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center ">
                      <MapPin
                        size={14}
                        fill="#fff"
                        strokeWidth={1}
                        className="text-red-900"
                      />
                    </span>
                  </div>
                  <input
                    type="text"
                    id="search-navbar"
                    value={location.name}
                    disabled
                    className="pl-10 pr-4 py-2 w-full text-gray-600 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => redirect("/outlets")}
                className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg w-full max-w-[411px] justify-center md:w-max md:max-w-none hover:bg-emerald-700 "
              >
                Lanjut
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                async function fetchData() {
                  await check();
                }
                fetchData();
              }}
              className="bg-emerald-600 hover:bg-emerald-700  text-white font-semibold px-16 py-2 rounded-lg w-full max-w-[411px] justify-center md:w-max md:max-w-none"
            >
              Aktifkan Lokasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
