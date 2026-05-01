import API_URL from '@/config';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [revenue, setRevenue] = useState(0);
    const [activeOrders, setActiveOrders] = useState(0);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users Count
                const userRes = await fetch(`${API_URL}/users/count`);
                if (userRes.ok) {
                    const data = await userRes.json();
                    setUserCount(data.count);
                }

                // Fetch Products Count
                const productRes = await fetch(`${API_URL}/products`);
                if (productRes.ok) {
                    const data = await productRes.json();
                    setProductCount(data.length);
                }

                // Fetch Orders
                const orderRes = await fetch(`${API_URL}/orders`);
                if (orderRes.ok) {
                    const data = await orderRes.json();
                    setOrders(data);

                    // Calculate Stats
                    const totalRevenue = data.reduce((acc: number, order: any) => {
                        const amount = parseFloat(order.amount.replace(/[^0-9.]/g, ""));
                        return acc + (isNaN(amount) ? 0 : amount);
                    }, 0);
                    setRevenue(totalRevenue);

                    const active = data.filter((order: any) => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
                    setActiveOrders(active);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    const stats = [
        {
            title: "Total Revenue",
            value: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "Lifetime revenue",
            icon: DollarSign,
        },
        {
            title: "Active Orders",
            value: activeOrders.toString(),
            change: "Orders in progress",
            icon: ShoppingBag,
        },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white font-playfair">Dashboard Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    index === 1 ? (
                        <Link key={index} to="/admin/orders">
                            <Card className="bg-white/5 border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-4 w-4 text-silver" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ) : (
                        <Card key={index} className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-silver" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                ))}

                {/* Registered Users Card with Link */}
                <Link to="/admin/users">
                    <Card className="bg-white/5 border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Registered Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-silver" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userCount}</div>
                            <p className="text-xs text-gray-500 mt-1">Total registered users</p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Total Products Card */}
                <Link to="/admin/products">
                    <Card className="bg-white/5 border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Total Collection
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-silver" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productCount}</div>
                            <p className="text-xs text-gray-500 mt-1">Total watches in stock</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-gray-500">
                            Chart Placeholder (Revenue Analytics)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {orders.length === 0 ? (
                                <p className="text-gray-500 text-sm">No recent sales.</p>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{order.customer}</p>
                                            <p className="text-sm text-gray-400">{order.product}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-silver">{order.amount}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;

