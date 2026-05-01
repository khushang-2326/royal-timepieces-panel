import API_URL from '@/config';
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Heart, ShoppingBag, Download, XCircle } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Orders = () => {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      // Fetch user details to get email for filtering orders
      fetch(`${API_URL}/users/${parsed.id}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch user");
        })
        .then(userData => {
          // Fetch orders and filter by user email
          fetch(`${API_URL}/orders`)
            .then(res => res.json())
            .then(ordersData => {
              // Filter by email, checking both top-level email (new orders) and contact.email (old orders)
              const userOrders = ordersData.filter((order: any) => {
                const orderEmail = order.email || (order.contact && order.contact.email);
                // Case-insensitive comparison and trim whitespace
                return orderEmail?.trim().toLowerCase() === userData.email?.trim().toLowerCase();
              });
              setOrders(userOrders);
            })
            .catch(err => console.error("Error fetching orders:", err));
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleCancelOrder = async () => {
    if (!selectedOrderToCancel) return;

    try {
      const response = await fetch(`${API_URL}/orders/${selectedOrderToCancel}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== selectedOrderToCancel));
        toast.success("Order cancelled successfully");
        setIsCancelDialogOpen(false);
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("An error occurred while cancelling the order");
    }
  };

  const handleDownloadInvoice = (order: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("ROYAL WATCHES", 14, 20);

    doc.setFontSize(12);
    doc.text("INVOICE", 14, 30);

    // Order Details
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 14, 40);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 14, 45);
    doc.text(`Status: ${order.status}`, 14, 50);
    doc.text(`Payment Method: ${order.paymentMethod || 'COD'}`, 14, 55);

    // Customer Details
    doc.text("Bill To:", 120, 40);
    doc.text(order.customer, 120, 45);
    if (order.address) {
      doc.text(`${order.address.street}`, 120, 50);
      doc.text(`${order.address.city}, ${order.address.state}`, 120, 55);
      doc.text(`${order.address.country} ${order.address.zip}`, 120, 60);
    }
    doc.text(`Mobile: ${order.mobile}`, 120, 65);
    if (order.email) doc.text(`Email: ${order.email}`, 120, 70);

    // Items Table
    const tableColumn = ["Item", "Quantity", "Price"];
    const tableRows: any[] = [];

    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const itemData = [
          item.name,
          item.quantity,
          item.price
        ];
        tableRows.push(itemData);
      });
    } else {
      // Fallback if items array is empty but product string exists
      tableRows.push([order.product, "1", order.amount]);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }, // Green color matching theme
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ${order.amount}`, 140, finalY + 15);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing Royal Watches.", 14, finalY + 30);

    doc.save(`invoice_${order._id}.pdf`);
    toast.success("Invoice downloaded");
  };

  return (
    <div className="min-h-screen bg-background">


      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-5xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-xl">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No orders found.</p>
                <Button variant="link" onClick={() => navigate("/collections")}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="glass-card rounded-lg p-6 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-playfair text-xl font-semibold">{order.product}</h4>
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                            className={order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600' : ''}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{order.amount}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-muted rounded overflow-hidden relative group">
                          {/* Placeholder image since backend only stores product name string currently */}
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-xs text-muted-foreground">Arrives in 3-5 business days</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownloadInvoice(order)}
                        >
                          <Download className="h-4 w-4" /> Invoice
                        </Button>

                        <Dialog open={isCancelDialogOpen && selectedOrderToCancel === order._id} onOpenChange={(open) => {
                          if (!open) setSelectedOrderToCancel(null);
                          setIsCancelDialogOpen(open);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setSelectedOrderToCancel(order._id);
                                setIsCancelDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" /> Cancel Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-950 border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle>Cancel Order</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Are you sure you want to cancel this order? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">
                                Keep Order
                              </Button>
                              <Button variant="destructive" onClick={handleCancelOrder}>
                                Yes, Cancel Order
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-xl">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Your wishlist is empty.</p>
                <Button variant="link" onClick={() => navigate("/collections")}>Browse Collections</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    onAddToCart={() => addToCart({ ...item, quantity: 1 })}
                    stock={10}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
};

export default Orders;

