import logo from "../assets/logo.png";
import dashboardicon from "../assets/dashboard-fill.png";
import peopleIcon from "../assets/people-fill.png";
// import menuIcom from "../assets/files.png";
// import inventoryIcon from "../assets/inevntory.png";
import reportIcon from "../assets/sheet.png";
import tablesIcon from "../assets/tables.png";
import reservationIcon from "../assets/calendare.png";
import kitchenIcon from "../assets/kitchen.png";
import logoutIcon from "../assets/logout-outlined.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBar() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user.user);
  console.log(user.role);

  const routes = [
    {
      title: "Dashboard",
      icon: dashboardicon,
      link: "/dashboard",
      access: ["admin", "operation"],
    },

    {
      title: "Sercice Managment",
      icon: reportIcon,
      link: "/managment",
      access: ["admin", "operation"],
    },
    // {
    //   title: "Menu",
    //   icon: menuIcom,
    //   link: "/menu",
    //   access: ["admin", "staff", "operation", "waiter"]
    // },
    {
      title: "Staff",
      icon: peopleIcon,
      link: "/staff",
      access: ["admin"],
    },
    // {
    //   title: "Inventory",
    //   icon: inventoryIcon,
    //   link: "/inventory",
    // },
    // {
    //   title: "Reports",
    //   icon: reportIcon,
    //   link: "/reports",
    // },
    {
      title: "Tables/Orders",
      icon: tablesIcon,
      link: "/orders-tables",
      access: ["admin", "operation", "waiter"],
    },
    {
      title: "Tables",
      icon: reservationIcon,
      link: "/table",
      access: ["admin", "operation", "waiter"],
    },
    {
      title: "Kitchen",
      icon: kitchenIcon,
      link: "/kitchen",
      access: ["admin", "staff", "operation"],
    },
    {
      title: "Attendance",
      icon: reservationIcon,
      link: "/kitchen",
      access: ["admin", "staff", "waiter"],
    },
  ];

  return (
    <div className="bg-secondary text-white px-4 pb-3 h-[1200px] overflow-hidden w-full flex flex-col">
      <div className="">
        <img className="w-full" src={logo} />
      </div>
      
      {/* Navigation items - takes remaining space */}
      <div className="flex-1 flex flex-col">
        {routes.map(
          (ele, index) =>
            ele.access.includes(user.role) && (
              <div
                onClick={() => navigate(ele.link)}
                key={index}
                className="flex flex-col justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6"
              >
                <img
                  src={ele.icon}
                  alt="icon"
                  className="mb-2 w-[30px] lg:w-[30px]"
                />
                <p className="text-sm text-center">{ele.title}</p>
              </div>
            )
        )}
      </div>

      {/* Logout button - stays at bottom */}
      <div
        onClick={() => {
          localStorage.removeItem("patriaUser");
          navigate("/login");
        }}
        className="flex flex-col items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6 mt-auto"
      >
        <img
          src={logoutIcon}
          alt="icon"
          className="mb-2 w-[30px] lg:w-[30px]"
        />
        <p className="text-sm text-center">Logout</p>
      </div>
    </div>
  );
}