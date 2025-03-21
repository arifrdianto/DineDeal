/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const { id } = await params;
  if (!id || id.length < 2) {
    return Response.json(
      { error: "Invalid parameters. Expected /api/outlets/:ida/:idb" },
      { status: 400 }
    );
  }

  try {
    const [grabId, ...goId] = id;

    const grabData = await fetch(
      `https://portal.grab.com/foodweb/v2/merchants/${grabId}`
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => {
        throw new Error("Failed to fetch data from GrabFood");
      });

    const path = goId.join("/");

    const goData = await fetch(
      `https://gofood.co.id/_next/data/${process.env.GF_API_VERSION}/${path}.json`,
      {
        headers: {
          "content-type": "application/json",
          Cookie: `csrfSecret=${process.env.GF_CSRF_SECRET}; XSRF-TOKEN=${process.env.GF_XSRF_TOKEN};`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => {
        throw new Error("Failed to fetch data from GoFood");
      });

    return new Response(
      JSON.stringify({
        name: goData.pageProps.outlet.core.displayName,
        photoHref: grabData.merchant.photoHref,
        cuisine: goData.pageProps.outlet.core.tags
          .map((tag: { displayName: string }) => tag.displayName)
          .join(", "),
        address: goData.pageProps.outlet.core.address.rows.join(", "),
        menus: [
          {
            provider: "GrabFood",
            providerImageSrc: `${process.env.NEXT_PUBLIC_SITE_URL}/logo-grabfood.svg`,
            rating: grabData.merchant.rating,
            priceLevel: grabData.merchant.priceTag,
            categories: grabData.merchant.menu.categories.map(
              (category: any) => ({
                id: category.id,
                name: category.name,
                products: category.items.map((product: any) => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  imgSrc: product.imgHref,
                  price: Number(
                    product.priceInMinorUnit.toString().slice(0, -2)
                  ),
                  priceDiscounted: Number(
                    product.discountedPriceInMin.toString().slice(0, -2)
                  ),
                  isPromo:
                    product.priceInMinorUnit !== product.discountedPriceInMin,
                })),
              })
            ),
          },
          {
            provider: "GoFood",
            providerImageSrc: `${process.env.NEXT_PUBLIC_SITE_URL}/logo-gofood.png`,
            rating: goData.pageProps.outlet.ratings.average,
            priceLevel: goData.pageProps.outlet.priceLevel,
            categories: goData.pageProps.outlet.catalog.sections
              .map((category: any) => ({
                id: category.uid,
                name: category.displayName,
                products: category.items.map((product: any) => ({
                  id: product.uid,
                  name: product.displayName,
                  description: product.description,
                  imgSrc: product.imageUrl,
                  price: Number(product.price.units),
                  priceDiscounted: Number(
                    product.promotion?.price?.units || product.price.units
                  ),
                  isPromo: !!product.promotion,
                })),
              }))
              .filter((category: any) => category.products.length > 0),
          },
        ],
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: "An error occurred",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
