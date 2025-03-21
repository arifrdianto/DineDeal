import { MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

export async function Navbar() {
  const cookieStore = await cookies();
  const cookieGfLoc = cookieStore.get("gf_loc")?.value;
  const locationName = cookieGfLoc ? JSON.parse(cookieGfLoc).name : "Jakarta";
  return (
    <nav className="bg-white border-gray-200 border-b h-28 md:h-20 w-full fixed left-0 top-0 z-30">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-center md:justify-between mx-auto p-4 h-28 md:h-20">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL}
          className="flex items-center space-x-3"
        >
          <div className="flex items-center justify-center gap-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-grabfood.svg`}
              alt="GrabFood"
              width={120}
              height={120}
            />
            ⚔️
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-gofood.png`}
              alt="GoFood"
              width={120}
              height={120}
            />
          </div>
        </a>

        <div className="items-center justify-between w-full md:flex md:w-auto md:order-1">
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
              value={locationName}
              disabled
              className="pl-10 pr-4 py-2 w-full text-gray-600 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
