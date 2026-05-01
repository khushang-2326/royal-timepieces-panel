import API_URL from '@/config';
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import watch3 from "@/assets/watch-3.jpg";
import { toast } from "sonner";
import { Lock } from "lucide-react";



import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const Auth = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("signin");

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        refreshCart();
        refreshWishlist();
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signUpData.name,
          email: signUpData.email,
          password: signUpData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        setActiveTab("signin");
        setSignUpData({ name: "", email: "", password: "" });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        {/* Left Side - Image & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={watch3}
            alt="Royal Timepieces"
            className="absolute inset-0 w-full h-full object-cover animate-scale-subtle"
          />
          <div className="relative z-20 flex flex-col justify-center px-12 text-white h-full">
            <h1 className="font-playfair text-6xl font-bold mb-6 leading-tight">
              Timeless <br />
              <span className="text-silver">Elegance</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-md leading-relaxed">
              Join our exclusive community of collectors and connoisseurs. Experience the pinnacle of Swiss horology.
            </p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
              <h2 className="font-playfair text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">
                Please enter your details to access your account
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-background data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-background data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-11 border-input focus:border-primary transition-colors"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="pl-10 h-11 border-input focus:border-primary transition-colors"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[hsl(var(--silver-light))] via-[hsl(var(--silver))] to-[hsl(var(--silver-dark))] text-black hover:opacity-90 transition-all duration-300 text-lg font-medium border-none"
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-11 border-input focus:border-primary transition-colors"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-11 border-input focus:border-primary transition-colors"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      className="h-11 border-input focus:border-primary transition-colors"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[hsl(var(--silver-light))] via-[hsl(var(--silver))] to-[hsl(var(--silver-dark))] text-black hover:opacity-90 transition-all duration-300 text-lg font-medium border-none"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
};

export default Auth;

