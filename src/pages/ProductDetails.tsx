import API_URL from '@/config';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Heart, ShieldCheck, Truck, Clock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: string;
  category: string;
  description: string;
  stock: number;
  image: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-24 px-4 md:px-12">
        <div className="animate-pulse space-y-8 flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 bg-white/5 h-[500px] rounded-2xl"></div>
          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <div className="h-10 bg-white/5 w-1/3 rounded"></div>
            <div className="h-16 bg-white/5 w-3/4 rounded"></div>
            <div className="h-8 bg-white/5 w-1/4 rounded"></div>
            <div className="h-32 bg-white/5 w-full rounded mt-8"></div>
            <div className="h-12 bg-white/5 w-1/2 rounded mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background">
        <h2 className="text-3xl font-playfair mb-4">Product Not Found</h2>
        <Button onClick={() => navigate("/collections")} variant="outline" className="border-white/10 mt-4 hover:bg-white/10">
          Return to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-silver/30">
      <div className="container mx-auto px-4 md:px-8 py-24 pb-32 max-w-7xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-12 group inline-flex"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to collections
        </button>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Image Gallery Column */}
          <div className="w-full lg:w-1/2">
            <div className="relative group rounded-3xl overflow-hidden bg-black aspect-[4/5] shadow-2xl ring-1 ring-white/10">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl ${
                  isInWishlist(product._id) 
                    ? 'bg-red-500/20 hover:bg-red-500/30' 
                    : 'bg-black/20 hover:bg-black/40'
                }`}
                onClick={handleWishlistClick}
              >
                <Heart className={`h-6 w-6 transition-colors ${
                  isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-white group-hover:scale-110"
                }`} />
              </Button>
            </div>
          </div>

          {/* Product Info Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs uppercase tracking-widest text-silver border border-silver/30 rounded-full font-semibold">
                {product.brand}
              </span>
              <span className="px-3 py-1 text-xs uppercase tracking-widest text-gray-400 border border-white/10 rounded-full bg-white/5">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-playfair text-white mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl md:text-4xl font-light text-silver mb-8">
              {product.price}
            </p>

            <div className="w-full h-[1px] bg-white/10 mb-8" />

            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {product.description || "Experience the pinnacle of fine watchmaking. This timepiece captures the perfect balance of elegance and precision engineering, crafted for those who demand nothing but the absolute best."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-8 text-lg bg-silver text-black hover:bg-white hover:scale-[1.02] transition-all duration-300 font-semibold shadow-xl shadow-silver/10"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-3 bg-white/5 rounded-full text-silver group-hover:scale-110 group-hover:bg-silver/20 transition-all">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Authenticity Guaranteed</h4>
                  <p className="text-sm text-gray-400 font-light">Includes certificate of origin and papers.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-3 bg-white/5 rounded-full text-silver group-hover:scale-110 group-hover:bg-silver/20 transition-all">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Secure Shipping</h4>
                  <p className="text-sm text-gray-400 font-light">Fully insured worldwide delivery.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-3 bg-white/5 rounded-full text-silver group-hover:scale-110 group-hover:bg-silver/20 transition-all">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">5-Year Warranty</h4>
                  <p className="text-sm text-gray-400 font-light">Official international guarantee.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="flex items-center justify-center h-12 w-12 bg-white/5 rounded-full text-silver group-hover:scale-110 group-hover:bg-silver/20 transition-all font-bold font-playfair text-xl">
                  {product.stock}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Currently Available</h4>
                  <p className="text-sm text-gray-400 font-light">Limited pieces remaining.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

