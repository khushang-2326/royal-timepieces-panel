import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  // Props are no longer needed for cart, but keeping interface if other props exist
}

export const Navbar = () => {
  const { cartItemCount, setCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="Royal Timepieces Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-cinzel font-bold gold-gradient-text hidden sm:block tracking-wider">
            Royal Timepieces
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-silver transition-colors">
            Home
          </Link>
          <Link to="/collections" className="text-foreground hover:text-silver transition-colors">
            Collections
          </Link>
          <Link to="/about" className="text-foreground hover:text-silver transition-colors">
            About Us
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <span className="text-sm font-medium text-silver mr-2">
              Hello, {user.username}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-silver">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuItem asChild>
                <Link to="/orders">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:text-silver"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <Button variant="ghost" size="icon" className="hover:text-silver" onClick={handleLogout} title="Log Out">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button asChild variant="ghost" className="hover:text-silver">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:text-silver"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {
        mobileMenuOpen && (
          <div className="md:hidden glass border-t border-border/50">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/collections"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/orders"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/settings"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                to="/auth"
                className="text-foreground hover:text-silver transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )
      }
    </nav >
  );
};
