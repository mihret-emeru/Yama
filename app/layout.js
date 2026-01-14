import "./globals.css";
import AppContent from "./components/AppContent";

export const metadata = {
  title: "Yama Bakery",
  description: "Bakery Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}

/* Recent Orders Table Card 

import "./globals.css";

import Sidebar from "./components/sidebar";

export const metadata = {
  title: "Bakery Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />

          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}*/
