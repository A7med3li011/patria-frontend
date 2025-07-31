import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoutes from "./services/ProtectedRoutes";
import ReverseProtectedRoutes from "./services/ReverseProtectedRoutes";
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
        { path: "/Dashboard", element: <Dashboard /> },
        { path: "/staff", element: <Staff /> },
        { path: "/add-staff", element: <AddStaff /> },
        { path: "/edit-staff/:id", element: <Editstaff /> },
        { path: "/service", element: <Managment /> },
        { path: "/add-category", element: <CategoryAdd /> },
        { path: "/add-sub-category", element: <SubCategoryAdd /> },
        { path: "/add-dish", element: <DishAdd /> },
        { path: "/inventory", element: <Inventory /> },
        { path: "/kitchen", element: <Kitchen /> },
        { path: "/kitchen/:id", element: <EachKitchen /> },
        { path: "/follow-order", element: <OrderTracking /> },
        { path: "/menu", element: <Menu /> },
        { path: "/orders-tables", element: <OrdersAndTables /> },
        { path: "/make-order", element: <MakeOrder /> },
        { path: "/table", element: <Tables /> },

        { path: "/reports", element: <Reports /> },
        { path: "/reservation", element: <Reservation /> },
        { path: "/managment", element: <Managment /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
