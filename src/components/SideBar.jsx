import logo from "../assets/logo.png";
import dashboardicon from "../assets/dashboard-fill.png";
import peopleIcon from "../assets/people-fill.png";
import menuIcom from "../assets/files.png";
import inventoryIcon from "../assets/inevntory.png";
import reportIcon from "../assets/sheet.png";
import tablesIcon from "../assets/tables.png";
import reservationIcon from "../assets/calendare.png";
import kitchenIcon from "../assets/kitchen.png";
import logoutIcon from "../assets/logout-outlined.png";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();

  const routes = [
    {
      title: "Dashboard",
      icon: dashboardicon,
      link: "/dashboard",
    },

    {
      title: "Sercive Managment",
      icon: reportIcon,
      link: "/managment",
    },
    {
      title: "Menu",
      icon: menuIcom,
      link: "/menu",
    },
    {
      title: "Staff",
      icon: peopleIcon,
      link: "/staff",
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
    },
    {
      title: "Tables",
      icon: reservationIcon,
      link: "/table",
    },
    {
      title: "Kitchen",
      icon: kitchenIcon,
      link: "/kitchen",
    },
    {
      title: "Attendance",
      icon: reservationIcon,
      link: "/kitchen",
    },
  ];

  return (
    <div className="bg-secondary text-white px-4 pb-3 h-[1200px]    overflow-hidden w-full flex flex-col">
      <div className="">
        <img className="w-full  " src={logo} />
      </div>
      <ul className="flex flex-col justify-between flex-1 ">
        {routes.map((ele, index) => (
          <li
            onClick={() => navigate(ele.link)}
            key={index}
            className="flex flex-col justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6"
          >
            <img
              src={ele.icon}
              alt="icon"
              className="mb-2 w-[30px] lg:w-[30px] "
            />
            <p className="text-sm text-center">{ele.title}</p>
          </li>
        ))}
        <li
          onClick={() => {
            localStorage.removeItem("patriaUser");
            navigate("/login");
          }}
          className="flex flex-col justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6"
        >
          <img
            src={logoutIcon}
            alt="icon"
            className="mb-2 w-[30px] lg:w-[30px] "
          />
          <p className="text-sm text-center">Logout</p>
        </li>
      </ul>
    </div>
  );
}
