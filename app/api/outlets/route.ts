import { sortRestaurantsByKeyword } from "@/utils/sorter";
import { NextRequest } from "next/server";

type GrabFoodOutlet = {
  id: string;
  merchantBrief: {
    displayInfo: { primaryText: string };
    photoHref: string;
    cuisine: string[];
    rating: number;
    distanceInKm: number;
    priceTag: number;
  };
};

type GoFoodOutlet = {
  core: {
    uid: string;
    displayName: string;
    tags: { displayName: string }[];
  };
  path: string;
  media: { coverImgUrl: string };
  ratings: { average: number };
  delivery: { distanceKm: number };
  priceLevel: number;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const goCookie = JSON.parse(request.cookies.get("gf_loc")?.value || "{}");
  const defaultLocation = {
    latitude: (goCookie.latitude || body.latitude) ?? -6.244068,
    longitude: (goCookie.longitude || body.longitude) ?? 106.802756,
  };

  try {
    let grabFood = [];

    grabFood = await fetch("https://portal.grab.com/foodweb/v2/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        latlng: `${defaultLocation.latitude},${defaultLocation.longitude}`,
        offset: 0,
        pageSize: 16,
        countryCode: "ID",
        ...body,
      }),
    })
      .then((res) => res.json())
      .then((data) =>
        data?.searchResult?.searchMerchants.map((item: GrabFoodOutlet) => ({
          id: item.id,
          name: item.merchantBrief.displayInfo.primaryText,
          imageSrc: item.merchantBrief.photoHref,
          imageSrcFallback:
            "https://food.grab.com/static/images/placeholder-restaurant-2by1.jpg",
          cuisine: item.merchantBrief.cuisine.join(", "),
          rating: item.merchantBrief.rating,
          distance:
            Math.round(item.merchantBrief.distanceInKm * 10) / 10 + " km",
          priceTag: item.merchantBrief.priceTag,
          provider: "GrabFood",
          providerImageSrc:
            "https://food.grab.com/static/images/logo-grabfood2.svg",
        }))
      )
      .catch(() => []);

    let goFood = [];

    const goFoodLocation = {
      name: goCookie.name || "Pasaraya Blok M",
      serviceAreaId: goCookie.serviceAreaId || "1",
      serviceArea: goCookie.serviceArea || "jakarta",
      locality: goCookie.locality || "jakarta-selatan",
      timezone: goCookie.timezone || "Asia/Jakarta",
      address:
        goCookie.address ||
        "Jl. Sultan Iskandarsyah II, No.I, Kebayoran Baru, RT.3/RW.1, Melawai",
      ...defaultLocation,
      ...body,
    };

    if (body.keyword) {
      goFood = await fetch(
        `https://gofood.co.id/_next/data/${process.env.GF_API_VERSION}/en/search.json?q=${body.keyword}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Cookie: `gf_chosen_loc=${encodeURIComponent(
              JSON.stringify(goFoodLocation)
            )};`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) =>
          data.pageProps.outlets.map((item: GoFoodOutlet) => ({
            id: item.core.uid,
            name: item.core.displayName,
            imageSrc: item.media.coverImgUrl,
            imageSrcFallback:
              "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/1efd299a-db9f-40d4-b6e9-973ee536bd3c_GENERIC_RESTAURANT_IMAGE.jpg",
            cuisine: item.core.tags
              .map((tag: { displayName: string }) => tag.displayName)
              .join(", "),
            rating: item.ratings.average,
            distance: item.delivery.distanceKm,
            path: item.path,
            priceTag: item.priceLevel,
            provider: "GoFood",
            providerImageSrc:
              "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/f9546f29-23c3-4384-adf9-03bb59a89136_gofood-logo.png?auto=format",
          }))
        )
        .catch(() => []);
    } else {
      goFood = await fetch("https://gofood.co.id/api/outlets", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: `csrfSecret=${process.env.GF_CSRF_SECRET}; XSRF-TOKEN=${process.env.GF_XSRF_TOKEN};`,
        },
        body: JSON.stringify({
          code: "NEAR_ME",
          location: {
            latitude: goFoodLocation.latitude,
            longitude: goFoodLocation.longitude,
          },
          timezone: goFoodLocation.timezone,
          pageSize: 16,
          language: "en",
          country_code: "ID",
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          data.outlets.map((item: GoFoodOutlet) => ({
            id: item.core.uid,
            name: item.core.displayName,
            imageSrc: item.media.coverImgUrl,
            imageSrcFallback:
              "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/1efd299a-db9f-40d4-b6e9-973ee536bd3c_GENERIC_RESTAURANT_IMAGE.jpg",
            cuisine: item.core.tags
              .map((tag: { displayName: string }) => tag.displayName)
              .join(", "),
            rating: item.ratings.average,
            distance: item.delivery.distanceKm,
            priceTag: item.priceLevel,
            path: item.path,
            provider: "GoFood",
            providerImageSrc:
              "https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/f9546f29-23c3-4384-adf9-03bb59a89136_gofood-logo.png?auto=format",
          }))
        )
        .catch((e) => {
          console.error(e);
          return [];
        });
    }

    const combinedData = [...(grabFood || []), ...goFood];
    const sortedData = sortRestaurantsByKeyword(combinedData, body.keyword);

    return Response.json(sortedData);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
}
