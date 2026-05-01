import { useState, useEffect, useMemo } from "react";
import API_URL from "@/config";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const Collections = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [activeBrand, setActiveBrand] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setProducts(data);
      } catch (parseError) {
        console.error("API returned non-JSON response:", text);
        throw new Error('Server returned an invalid response (HTML instead of JSON)');
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load collections");
    } finally {

      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const brands = useMemo(() => {
    const predefinedBrands = ["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", "Richard Mille", "Seiko", "Casio"];
    const availableBrands = new Set(products.map(p => p.brand).filter(Boolean));
    // Merge predefined and available, remove duplicates, sort
    const allBrands = Array.from(new Set([...predefinedBrands, ...availableBrands])).sort();
    return ["All", ...allBrands];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeBrand !== "All") {
      result = result.filter(p => p.brand === activeBrand);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceB - priceA;
      });
    }

    return result;
  }, [products, activeBrand, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Timeless Collections
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Discover our masterpiece selection of Swiss engineering and luxury design.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        {/* Filters & Controls */}
        <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

            {/* Brands */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeBrand === brand
                      ? "bg-white text-black shadow-lg scale-105"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search watches..."
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-[450px] rounded-xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white/5 rounded-xl border border-white/10">
            <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-playfair text-white mb-2">No timepieces found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
            <Button
              variant="link"
              className="mt-4 text-silver hover:text-white"
              onClick={() => {
                setActiveBrand("All");
                setSearchQuery("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product._id}
                  image={product.image || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80"}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  stock={product.stock}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
