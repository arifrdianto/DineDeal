export async function POST(request: Request) {
  const params = await request.json();

  if (!params.lat || !params.long) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const response = await fetch(
    `https://gofood.co.id/api/poi/reverse-geocode?latlong=${params.lat},${params.long}`,
    {
      headers: {
        Cookie: `csrfSecret=${process.env.GF_CSRF_SECRET}; XSRF-TOKEN=${process.env.GF_XSRF_TOKEN};`,
      },
    }
  );

  const data = await response.json();
  const cookie = `gf_loc=${encodeURIComponent(
    JSON.stringify({
      ...data,
      serviceArea: data.service_area_name,
      locality: data.locality_name,
      serviceAreaId: data.service_area_id,
    })
  )}; Path=/; Secure; SameSite=Strict`;

  return new Response(JSON.stringify(data), {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
