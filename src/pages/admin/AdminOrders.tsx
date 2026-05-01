import API_URL from '@/config';
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, MapPin, Phone, Package, Search, X, ShieldCheck } from "lucide-react";

// ... interfaces ...

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("user") || "");

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const userParam = searchParams.get("user");
        if (userParam) {
            setSearchTerm(userParam);
        }
    }, [searchParams]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearSearch = () => {
        setSearchTerm("");
        setSearchParams({});
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-white font-playfair">User Orders</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!e.target.value) setSearchParams({});
                        }}
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full hover:bg-transparent text-muted-foreground hover:text-white"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-400">Order ID</TableHead>
                            <TableHead className="text-gray-400">Customer</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id} className="border-white/10 hover:bg-white/5 text-white">
                                <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>{order.amount}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={order.status === "Delivered" ? "default" : "secondary"}
                                        className={order.status === "Delivered" ? "bg-green-600" : order.status === "Processing" ? "bg-yellow-600" : "bg-blue-600"}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-white/10 hover:text-silver"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-playfair">Order Details</DialogTitle>
                                                <DialogDescription className="text-gray-400">
                                                    Order #{order._id} • {new Date(order.date).toLocaleString()}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <ScrollArea className="max-h-[60vh] pr-4">
                                                <div className="space-y-6">
                                                    {/* Customer Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold flex items-center gap-2 text-silver">
                                                                <MapPin className="h-4 w-4" /> Shipping Address
                                                            </h4>
                                                            {order.address ? (
                                                                <div className="text-sm text-gray-300 space-y-1">
                                                                    <p>{order.address.street}</p>
                                                                    <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                                                    <p>{order.address.country}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">No address provided</p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold flex items-center gap-2 text-silver">
                                                                <Phone className="h-4 w-4" /> Contact Info
                                                            </h4>
                                                            <div className="text-sm text-gray-300 space-y-1">
                                                                <p className="font-medium text-white">{order.customer}</p>
                                                                <p>{order.mobile}</p>
                                                                {order.email && <p>{order.email}</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold flex items-center gap-2 text-silver">
                                                                <ShieldCheck className="h-4 w-4" /> Payment Method
                                                            </h4>
                                                            <p className="text-sm text-gray-300">{order.paymentMethod || "Cash on Delivery"}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold flex items-center gap-2 text-silver">
                                                                Status
                                                            </h4>
                                                            <div className="flex gap-2">
                                                                <Badge variant="outline" className="text-white border-white/20">
                                                                    Payment: {order.paymentStatus || "Pending"}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-white border-white/20">
                                                                    Order: {order.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    {/* Order Items */}
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold flex items-center gap-2 text-silver">
                                                            <Package className="h-4 w-4" /> Order Items
                                                        </h4>
                                                        {order.items && order.items.length > 0 ? (
                                                            order.items.map((item: any, index: number) => (
                                                                <div key={index} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                                                    {item.image && (
                                                                        <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{item.name}</p>
                                                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                                    </div>
                                                                    <div className="font-medium text-sm">{item.price}</div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm">{order.product || "Unknown Product"}</p>
                                                                </div>
                                                                <div className="font-medium text-sm">{order.amount}</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    {/* Total */}
                                                    <div className="flex justify-between items-center pt-2">
                                                        <span className="font-semibold text-lg">Total Amount</span>
                                                        <span className="font-bold text-xl text-silver">{order.amount}</span>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div >
        </div >
    );
};

export default AdminOrders;

