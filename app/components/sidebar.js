"use client";
import { usePathname } from "next/navigation";

// import icons
import {
  FaHome,
  FaClipboardList,
  FaClock,
  FaHistory,
  FaMoneyBillWave,
  FaUsers,
  FaBoxOpen,
  FaWarehouse,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();

  /* Main content wrapper 
  const links = [
    { title: "Dashboard", path: "/" },
    { title: "Orders", path: "/orders" },
    { title: "Preorder", path: "/preorder" },
    { title: "Order History", path: "/order-history" },
    { title: "Payment", path: "/payment" },
    { title: "Customer", path: "/customers" },
    { title: "Products", path: "/products" },
    { title: "Inventory", path: "/inventory" },
    { title: "Analytics", path: "/analytics" },
    { title: "Settings", path: "/settings" },
  ];*/

  const links = [
    { title: "Dashboard", path: "/", icon: <FaHome /> },
    { title: "Orders", path: "/orders", icon: <FaClipboardList /> },
    { title: "Preorder", path: "/preorder", icon: <FaClock /> },
    {
      title: "Order History",
      path: "/order-history",
      icon: <FaHistory />,
    },
    { title: "Payment", path: "/payment", icon: <FaMoneyBillWave /> },

    { title: "Customer", path: "/customers", icon: <FaUsers /> },
    { title: "Products", path: "/products", icon: <FaBoxOpen /> },
    { title: "Inventory", path: "/inventory", icon: <FaWarehouse /> },
    { title: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    { title: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Bread.png" alt="Bakery Logo" className="sidebar-logo" />
        <div className="sidebar-title">
          <h2>Yama</h2>
          <p>Bakery manager</p>
        </div>
      </div>
      <div className="sidebar-divider"></div>

      {links.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={pathname === item.path ? "active-link" : ""}
        >
          <span className="icon">{item.icon}</span>
          {item.title}
        </a>
      ))}
      <div className="sidebar-divider"></div>
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt className="logout-icon" />
        Logout
      </button>
    </div>
  );
}
