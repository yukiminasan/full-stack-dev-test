import { useCallback, useState } from "react";
const key = import.meta.env.VITE_GEOAPIFY_API_KEY as string | undefined;

export interface Restaurant {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface GeoapifyFeature {
  properties: {
    place_id?: string;
    name?: string;
    formatted?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

const SEARCH_RADIUS_MILES = 5;
const SEARCH_RADIUS_METERS = SEARCH_RADIUS_MILES * 1609.344;
const RESTAURANT_CATEGORIES = "catering.restaurant";
const COUNTRY_CODE = "ph";

export const useRestaurants = () => {
  const [rows, setRows] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  

  const loadRestaurants = useCallback(
    async (location: string) => {
      if (!key) {
        setError("No api key");
        return;
      }

      setPending(true);
      setError("");

      try {
        const geocodeQuery = new URLSearchParams({
          text: `${location}, Philippines`,
          filter: `countrycode:${COUNTRY_CODE}`,
          type: "city",
          limit: "1",
          apiKey: key,
        });
        const geocodeRes = await fetch(
          `https://api.geoapify.com/v1/geocode/search?${geocodeQuery}`,
        );
        if (!geocodeRes.ok) {
          setError(geocodeRes.statusText);
          return;
        }

        const geocodeData = (await geocodeRes.json()) as GeoapifyResponse;
        const center = geocodeData.features[0]?.geometry.coordinates;
        if (!center) {
          setError("No location found");
          return;
        }

        const [longitude, latitude] = center;
        const placesQuery = new URLSearchParams({
          categories: RESTAURANT_CATEGORIES,
          filter: `circle:${longitude},${latitude},${SEARCH_RADIUS_METERS}`,
          apiKey: key,
          limit: "100",
        });
        const placesRes = await fetch(
          `https://api.geoapify.com/v2/places?${placesQuery}`,
        );
        if (!placesRes.ok) {
          setError(placesRes.statusText);
          return;
        }

        const placesData = (await placesRes.json()) as GeoapifyResponse;
        const newRows = placesData.features.map((feature) => {
          const [featureLongitude, featureLatitude] =
            feature.geometry.coordinates;
          return {
            place_id:
              feature.properties.place_id ??
              `${featureLatitude}-${featureLongitude}`,
            name: feature.properties.name ?? "Unnamed restaurant",
            address: feature.properties.formatted ?? "No address",
            latitude: featureLatitude,
            longitude: featureLongitude,
          };
        });
        setRows(newRows);
      } catch {
        setError("Request failed");
      } finally {
        setPending(false);
      }
    },
    [],
  );

  const clearRestaurants = useCallback(() => {
    setRows([]);
    setError("");
  }, []);

  return {
    rows,
    error,
    pending,
    loadRestaurants,
    clearRestaurants,
  };
};
