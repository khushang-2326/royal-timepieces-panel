import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id?: string;
  image: string;
  name: string;
  price: string;
  description?: string;
  stock?: number;
  onAddToCart?: () => void;
}

export const ProductCard = ({ id, image, name, price, description, stock, onAddToCart }: ProductCardProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      toggleWishlist({ id, name, price, image });
    }
  };

  return (
    <div 
      className="glass-card rounded-lg overflow-hidden group flex flex-col h-full relative cursor-pointer" 
      onClick={() => id && navigate(`/product/${id}`)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {stock !== undefined && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${stock > 0 ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
          </div>
        )}
        {id && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all"
            onClick={handleWishlistClick}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(id) ? "fill-red-500 text-red-500" : "text-white"}`} />
          </Button>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-playfair text-xl font-semibold mb-2 text-foreground">{name}</h3>
        {description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-semibold text-silver">{price}</p>
          <Button
            size="icon"
            variant="outline"
            className="border-silver text-silver hover:bg-silver hover:text-black transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            disabled={stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
