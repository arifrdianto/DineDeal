import { Outlet } from "@/app/types/outlet";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

export default function OutletDetail({
  merchant,
  onClick,
  selectedItems = [null, null],
}: {
  merchant: Outlet;
  selectedItems: [Outlet | null, Outlet | null];
  onClick?: (outlet: Outlet) => void;
}) {
  const isSelected = selectedItems.some(
    (selected) => selected?.id === merchant.id
  );

  const isSameProvider = selectedItems.some(
    (selected) => selected?.provider === merchant.provider
  );

  const handleClik = () => {
    if (isSameProvider && !isSelected) return;

    if (onClick) {
      onClick(merchant);
    }
  };

  return (
    <div
      onClick={handleClik}
      className={`relative border border-gray-300 hover:border-emerald-600 transition-all duration-300 ease-in-out rounded-xl hover:md:shadow-xl ${
        isSameProvider && !isSelected ? "cursor-not-allowed" : "cursor-pointer "
      }`}
    >
      {(isSelected || isSameProvider) && (
        <div className="bg-gray-400 opacity-60 flex absolute items-center justify-center top-0 left-0 w-full h-full rounded-xl z-20">
          {isSelected && (
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gray-600 text-white">
              <span className="text-xl font-medium">Selected</span>
            </div>
          )}
        </div>
      )}
      <div className="bg-white rounded-2xl flex p-2 lg:h-auto lg:w-full lg:flex-col md:min-h-[168px] md:!rounded-2xl md:p-1.5 relative after:absolute after:left-0 after:bottom-0 after:block after:w-full after:h-px after:bg-background-border-secondary md:after:hidden last-of-type:after:hidden">
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
              className="overflow-hidden rounded-lg object-cover h-full md:h-auto w-full"
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
                    i < merchant.priceTag ? "text-gray-900" : "text-gray-400"
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
  );
}
