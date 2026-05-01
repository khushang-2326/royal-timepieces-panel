import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    ShoppingBag,
    Watch,
    LogOut,
    RefreshCw
} from "lucide-react";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";
        if (!isAuthenticated) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuthenticated");
        navigate("/admin/login");
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const navItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/orders", label: "User Orders", icon: ShoppingBag },
        { path: "/admin/products", label: "Manage Watches", icon: Watch },
    ];

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:flex flex-col fixed h-full inset-y-0 left-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-white/10 gap-3">
                    <img src="/logo.jpg" alt="Royal Timepieces Logo" className="h-8 w-auto" />
                    <h1 className="font-cinzel text-xl font-bold text-white tracking-wider">
                        Royal Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 mb-1 ${location.pathname === item.path
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Fixed Header */}
                <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md fixed top-0 right-0 left-0 md:left-64 z-40 flex items-center justify-end px-8">
                    <Button
                        variant="ghost"
                        className="gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Page
                    </Button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto pt-20 p-8">
                    <div key={refreshKey} className="animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
