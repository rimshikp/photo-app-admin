import Layout from "./components/Layout/Layout";
import Dashboard from "./dashboard/dashboard/index.jsx";
import Customers from "./dashboard/customers/index.jsx";
import PhotoGraphers from "./dashboard/photographers/index.jsx";
import Events from "./dashboard/events/index.jsx";

import Photos from "./dashboard/Photos";
import Login from "./pages/login/index";
import SignUp from "./pages/signup/index";
import EmailVerification from "./pages/email-verification/index";
import ForgotPassword from "./pages/forgot-password/index";
import ResetPassword from "./pages/reset-password/index";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./pages/not-found/index";
import PhotoUpload from "./dashboard/upload/index.jsx";
import PhotoGrapherDetails from "./dashboard/photographer-details/index.jsx";
import PhotoDetailPage from "./dashboard/photographer-details/photo-details/index.jsx";
import CustomerDetails from "./dashboard/customer-details/index.jsx"
const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "/dashboard/customers",
        element: <Customers />,
      },
      {
        path: "/dashboard/photographers",
        element: <PhotoGraphers />,
      },
      {
        path: "/dashboard/photographers/:id",
        element: <PhotoGrapherDetails />,
      },
      {
        path: "/dashboard/customers/:id",
        element: <CustomerDetails />,
      },
      {
        path: "/dashboard/photographers/:id/gallery/:photo_id",
        element: <PhotoDetailPage />,
      },

      {
        path: "/dashboard/models",
        element: <Events />,
      },

      {
        path: "/dashboard/upload",
        element: <PhotoUpload />,
      },

      {
        path: "/dashboard/photos",
        element: <Photos />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
