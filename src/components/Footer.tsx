import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-secondary/30 border-t border-border/50 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="font-playfair text-2xl font-bold gold-gradient-text">
                            ROYAL WATCHES
                        </h3>
                        <p className="text-muted-foreground">
                            Experience the pinnacle of Swiss craftsmanship and timeless elegance.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-playfair text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/collections" className="text-muted-foreground hover:text-primary transition-colors">
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-playfair text-lg font-semibold mb-6">Customer Service</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-muted-foreground hover:text-primary transition-colors">
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                                    Returns & Exchanges
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-playfair text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-muted-foreground">
                                <MapPin size={20} className="mt-1 text-primary" />
                                <span>123 Luxury Avenue, Geneva, Switzerland</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Phone size={20} className="text-primary" />
                                <span>+41 22 555 0123</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Mail size={20} className="text-primary" />
                                <span>concierge@royalwatches.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Royal Watches. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
