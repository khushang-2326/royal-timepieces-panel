import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartItemCount } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => {
        const p = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return acc + p * item.quantity;
    }, 0);

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-white">Your Cart</h1>
                
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-xl border border-white/5">
                        <div className="text-6xl mb-6">🛒</div>
                        <h2 className="text-2xl font-playfair mb-4 text-white">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            It seems you haven't added any luxury timepieces to your cart yet. Discover our exclusive collection to find your perfect match.
                        </p>
                        <Button 
                            onClick={() => navigate("/collections")}
                            className="bg-silver text-black hover:bg-white px-8 py-6 text-lg font-semibold"
                        >
                            Explore Collections
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                    <Link to={`/product/${item.id}`} className="shrink-0 group">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-black overflow-hidden relative">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>
                                    
                                    <div className="flex-grow flex flex-col justify-center">
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-white hover:text-silver transition-colors mb-2">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-lg text-silver mb-4">{item.price}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1 border border-white/10 w-fit">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:text-white text-gray-400 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:text-white text-gray-400 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8 sticky top-24">
                                <h2 className="text-2xl font-playfair mb-6 text-white border-b border-white/10 pb-4">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({cartItemCount} items)</span>
                                        <span className="text-white">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-400">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Taxes</span>
                                        <span className="text-white">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg text-white">Estimated Total</span>
                                        <span className="text-2xl font-semibold text-silver">
                                            ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">USD</p>
                                </div>

                                <Button 
                                    onClick={() => navigate("/checkout")}
                                    className="w-full bg-silver text-black hover:bg-white py-6 text-lg font-semibold group flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                
                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        Secure Checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
