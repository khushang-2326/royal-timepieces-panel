import { X, Trash2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartOpen, setCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const subtotal = cartItems.reduce((sum, item) => {
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 glass border-l border-border/50 z-50 transform transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="font-playfair text-2xl font-bold">Shopping Cart</h2>
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} className="hover:text-primary">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 glass-card p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary font-semibold mt-1">{item.price}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleWishlist({ id: item.id, name: item.name, price: item.price, image: item.image })}
                      className="hover:text-red-500"
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-border/50 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-bold text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <Separator />
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
              >
                Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
