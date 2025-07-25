import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/signin.tsx'),
    route('api/create-trip', 'routes/api/create-trip.ts'),
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', 'routes/admin/dashboard.tsx'),
        route('all-users', 'routes/admin/all-users.tsx'),
        route('trips/create', 'routes/admin/create-trip.tsx'),
        route('trips', 'routes/admin/trips.tsx')
    ])
] satisfies RouteConfig;