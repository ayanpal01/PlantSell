"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const navItems = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/products", icon: "🌿", label: "Products" },
  { href: "/admin/orders", icon: "📦", label: "Orders" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
  };

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <Link href="/admin/dashboard" className="adm-logo">
          <span className="logo-leaf" style={{ width: 22, height: 22 }} />
          PlantSell
        </Link>
        <span className="adm-admin-badge">Admin</span>
      </div>

      <nav className="adm-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`adm-nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span className="adm-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="adm-sidebar-footer">
        <div className="adm-user-info">
          <div className="adm-user-avatar">{(user?.name || "A")[0]}</div>
          <div>
            <div className="adm-user-name">{user?.name}</div>
            <div className="adm-user-role">Administrator</div>
          </div>
        </div>
        <div className="adm-sidebar-links">
          <Link href="/" className="adm-view-site">View Site ↗</Link>
          <button className="adm-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </aside>
  );
}
