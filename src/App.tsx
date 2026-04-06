import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { RestaurantRow } from "./components/RestaurantRow";
import { useRestaurants } from "./hooks/useRestaurants";

export const App = () => {
  const [location, setLocation] = useState("");
  const [debouncedLocation] = useDebounceValue(location, 200);
  const { rows, error, pending, loadRestaurants, clearRestaurants } = useRestaurants();

  useEffect(() => {
    const nextLocation = debouncedLocation.trim();
    clearRestaurants();
    if (!nextLocation) return;
    void loadRestaurants(nextLocation);
  }, [clearRestaurants, debouncedLocation, loadRestaurants]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-app-border bg-app-surface p-5 sm:p-6">
        <h1 className="text-3xl font-semibold text-app-text-heading">
          Find Restaurants
        </h1>
        <p className="mt-2 text-sm text-app-text">
          Search any city to see nearby restaurants.
        </p>
        <div className="mt-5">
        <input
          className="w-full rounded-xl border border-app-border bg-app-surface px-4 py-3 text-base text-app-text-heading outline-none transition focus:border-app-accent"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a location"
        />
        {pending ? <p className="mt-4 text-sm text-app-text">Loading...</p> : null}
        {error ? <p className="mt-4 text-sm text-app-danger">{error}</p> : null}
        {!pending && !error && location.trim() && rows.length === 0 ? (
          <p className="mt-4 text-sm text-app-text">No restaurants found.</p>
        ) : null}
      </div>
      </div>
  
      <div className="mt-5">
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <RestaurantRow key={r.place_id} row={r} />
          ))}
        </ul>
      </div>
    </div>
  );
};
