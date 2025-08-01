import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoutes from "./services/ProtectedRoutes";
import ReverseProtectedRoutes from "./services/ReverseProtectedRoutes";
import RoleBasedRoute from "./services/RoleBasedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Inventory from "./pages/Inventory";
import Kitchen from "./pages/Kitchen";
import Menu from "./pages/Menu";
import OrdersAndTables from "./pages/OrdersAndTables";
import Staff from "./pages/Staff";
import Reports from "./pages/Reports";
import Reservation from "./pages/Reservation";
import Managment from "./pages/Managment";
import CategoryAdd from "./components/category/CategoryAdd";
import SubCategoryAdd from "./components/subCategory/SubCategoryAdd";
import DishAdd from "./components/dishes/DishAdd";
import OrderTracking from "./components/order/OrderTracking";
import AddStaff from "./components/Staff/AddStaff";
import Editstaff from "./components/Staff/Editstaff";
import EachKitchen from "./pages/EachKitchen";
import MakeOrder from "./components/order/MakeOrder";
import { Table } from "lucide-react";
import Tables from "./pages/Tables";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <ReverseProtectedRoutes>
          <Login />
        </ReverseProtectedRoutes>
      ),
    },
    {
      path: "",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      children: [
        { 
          path: "/Dashboard", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Dashboard />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/staff", 
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Staff />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/add-staff", 
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AddStaff />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/edit-staff/:id", 
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Editstaff />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/service", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Managment />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/add-category", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <CategoryAdd />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/add-sub-category", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <SubCategoryAdd />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/add-dish", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <DishAdd />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/inventory", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Inventory />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/kitchen", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "staff", "operation"]}>
              <Kitchen />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/kitchen/:id", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "staff", "operation"]}>
              <EachKitchen />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/follow-order", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation", "waiter"]}>
              <OrderTracking />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/menu", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Menu />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/orders-tables", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation", "waiter"]}>
              <OrdersAndTables />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/make-order", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation", "waiter"]}>
              <MakeOrder />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/table", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation", "waiter"]}>
              <Tables />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/reports", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Reports />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/reservation", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Reservation />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/managment", 
          element: (
            <RoleBasedRoute allowedRoles={["admin", "operation"]}>
              <Managment />
            </RoleBasedRoute>
          ) 
        },
        { 
          path: "/attendance", 
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Attendance />
            </RoleBasedRoute>
          ) 
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
