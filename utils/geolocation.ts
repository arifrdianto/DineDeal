export const getCurrentLocation = (): Promise<{
  lat: number;
  long: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const checkGeolocationPermission = async (): Promise<
  GeolocationPosition | GeolocationPositionError
> => {
  if (!navigator.permissions) {
    throw new Error("Permissions API is not supported in this browser.");
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permissionStatus.state === "granted") {
      return requestGeolocationPermission();
    } else {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  } catch {
    throw new Error("Failed to check geolocation permission.");
  }
};

export const requestGeolocationPermission = (): Promise<
  GeolocationPosition | GeolocationPositionError
> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
