import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-watch.jpg";
import watch1 from "@/assets/watch-1.jpg";
import watch2 from "@/assets/watch-2.jpg";
import watch3 from "@/assets/watch-3.jpg";
import watch4 from "@/assets/watch-4.jpg";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const bestSellers = [
    { id: "1", image: watch1, name: "Classic Heritage", price: "$12,500" },
    { id: "2", image: watch2, name: "Gold Chronograph", price: "$18,900" },
    { id: "3", image: watch3, name: "Skeleton Masterpiece", price: "$24,500" },
    { id: "4", image: watch4, name: "Diver's Elite", price: "$15,200" },
  ];

  const handleAddToCart = (product: typeof bestSellers[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen">


      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-in fade-in zoom-in duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 animate-in fade-in duration-1000 delay-300 fill-mode-backwards">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 gold-gradient-text">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
            Discover Swiss craftsmanship and precision in every detail
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            onClick={() => navigate("/collections")}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-y border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
            <div className="flex flex-col items-center text-center space-y-3">
              <Award className="h-12 w-12 text-primary" />
              <h3 className="font-playfair text-xl font-semibold">Swiss Movement</h3>
              <p className="text-muted-foreground">Authentic Swiss precision engineering</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Shield className="h-12 w-12 text-primary" />
              <h3 className="font-playfair text-xl font-semibold">Lifetime Warranty</h3>
              <p className="text-muted-foreground">Protected craftsmanship guarantee</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Truck className="h-12 w-12 text-primary" />
              <h3 className="font-playfair text-xl font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Worldwide delivery at no cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Index;
