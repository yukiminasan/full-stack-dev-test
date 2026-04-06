import type { Restaurant } from '../hooks/useRestaurants'

interface RestaurantRowProps {
  row: Restaurant
}

export const RestaurantRow = ({ row }: RestaurantRowProps) => (
  <li className="rounded-xl border border-app-border bg-app-surface p-4 shadow-sm transition hover:border-app-accent-border hover:bg-app-accent-bg">
    <p className="text-base font-semibold text-app-text-heading">{row.name}</p>
    <p className="mt-1 text-sm text-app-text">{row.address}</p>
    <p className="mt-2 text-xs text-app-text">
      {row.latitude}, {row.longitude}
    </p>
  </li>
)
