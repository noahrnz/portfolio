import { createHashRouter, Navigate } from "react-router";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import LocationsPage from "./pages/LocationsPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";

// Hash router so the app works inside an iframe at any path (e.g. /prototypes/climbing-gym/index.html)
export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: (
      <div style={{ padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
        Something went wrong. <a href="#/">Go home</a>
      </div>
    ),
    children: [
      { index: true, Component: HomePage },
      { path: "locations", Component: LocationsPage },
      { path: "bookings", Component: BookingsPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
