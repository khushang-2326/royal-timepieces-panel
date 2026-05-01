import API_URL from '@/config';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ShieldCheck, Truck, Loader2, CreditCard } from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'online'

    const subtotal = cartItems.reduce((sum, item) => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return sum + priceNum * item.quantity;
    }, 0);

    const total = subtotal;

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Fetch fresh user data to get the latest address
            fetch(`${API_URL}/users/${parsedUser.id}`)
                .then(res => res.json())
                .then(userData => {
                    if (userData) {
                        setFormData(prev => ({
                            ...prev,
                            email: userData.email || "",
                            mobile: userData.phone || "",
                            address1: userData.address?.street || "",
                            city: userData.address?.city || "",
                            state: userData.address?.state || "",
                            zip: userData.address?.zip || "",
                            country: userData.address?.country || "",
                            firstName: userData.username ? userData.username.split(' ')[0] : "",
                            lastName: userData.username ? userData.username.split(' ').slice(1).join(' ') : ""
                        }));
                    }
                })
                .catch(err => console.error("Failed to fetch user details", err));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [saveInfo, setSaveInfo] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                customer: `${formData.firstName} ${formData.lastName}`,
                product: cartItems.map(item => item.name).join(", "),
                items: cartItems,
                amount: `$${total.toLocaleString()}`,
                address: {
                    street: formData.address1,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country
                },
                mobile: formData.mobile,
                email: formData.email,
                paymentMethod: paymentMethod === 'cod' ? "Cash on Delivery" : "Online (Razorpay)",
                contact: {
                    email: formData.email,
                    phone: formData.mobile,
                    name: `${formData.firstName} ${formData.lastName}`
                }
            };

            // Save user info if requested
            if (user && saveInfo) {
                try {
                    await fetch(`${API_URL}/users/${user.id}/checkout-info`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            address: {
                                street: formData.address1,
                                city: formData.city,
                                state: formData.state,
                                zip: formData.zip,
                                country: formData.country
                            },
                            phone: formData.mobile
                        })
                    });
                } catch (err) {
                    console.error("Failed to save user checkout info", err);
                }
            }

            if (paymentMethod === 'online') {
                // Create Razorpay Order
                const response = await fetch(`${API_URL}/payment/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total })
                });

                const order = await response.json();

                if (!response.ok) {
                    throw new Error("Failed to create Razorpay order");
                }

                const options = {
                    key: "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
                    amount: order.amount,
                    currency: order.currency,
                    name: "Royal Timepieces",
                    description: "Luxury Watch Purchase",
                    image: "/logo.jpg", // Ensure you have a logo at this path
                    order_id: order.id,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderData: orderData
                                })
                            });

                            const verifyData = await verifyRes.json();

                            if (verifyRes.ok) {
                                toast.success("Payment successful! Order placed.");
                                clearCart();
                                navigate("/orders");
                            } else {
                                toast.error(verifyData.error || "Payment verification failed");
                            }
                        } catch (error) {
                            console.error("Verification error:", error);
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.mobile
                    },
                    theme: {
                        color: "#000000"
                    }
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.on('payment.failed', function (response: any) {
                    toast.error(response.error.description || "Payment failed");
                });
                rzp1.open();

            } else {
                // COD Flow
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success("Order placed successfully!");
                    clearCart();
                    navigate("/orders");
                } else {
                    toast.error(data.message || "Failed to place order");
                }
            }

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("An error occurred while placing your order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) return null;

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <h1 className="font-playfair text-4xl font-bold mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                                <CardDescription>Enter your delivery details below.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                                readOnly={!!user}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">Mobile Number</Label>
                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                required
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address1">Address Line 1</Label>
                                        <Input
                                            id="address1"
                                            name="address1"
                                            required
                                            placeholder="123 Luxury Lane"
                                            value={formData.address1}
                                            onChange={handleInputChange}
                                            className="bg-background/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                                        <Input
                                            id="address2"
                                            name="address2"
                                            placeholder="Apartment, Suite, etc."
                                            value={formData.address2}
                                            onChange={handleInputChange}
                                            className="bg-background/50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State / Province</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">Zip / Postal Code</Label>
                                            <Input
                                                id="zip"
                                                name="zip"
                                                required
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                className="bg-background/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            required
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="bg-background/50"
                                        />
                                    </div>

                                    {user && (
                                        <div className="flex items-center space-x-2 pt-4">
                                            <input
                                                type="checkbox"
                                                id="saveInfo"
                                                checked={saveInfo}
                                                onChange={(e) => setSaveInfo(e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="saveInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Save this information for next time
                                            </Label>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>All transactions are secure and encrypted.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-primary/10 border-primary' : 'bg-background/30 border-border'}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <ShieldCheck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="font-medium">Cash on Delivery</p>
                                        <p className="text-sm text-muted-foreground">Pay when you receive your order.</p>
                                    </div>
                                </div>

                                <div
                                    className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors mt-3 ${paymentMethod === 'online' ? 'bg-primary/10 border-primary' : 'bg-background/30 border-border'}`}
                                    onClick={() => setPaymentMethod('online')}
                                >
                                    <CreditCard className={`h-6 w-6 ${paymentMethod === 'online' ? 'text-primary' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="font-medium">Pay Online (Razorpay)</p>
                                        <p className="text-sm text-muted-foreground">Secure payment via Credit/Debit Card, UPI, etc.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="glass-card border-border/50 sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium line-clamp-1">{item.name}</p>
                                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="font-medium">{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-500 flex items-center gap-1">
                                            Free <Truck className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                                    type="submit"
                                    form="checkout-form"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

