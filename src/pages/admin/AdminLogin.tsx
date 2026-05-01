import API_URL from '@/config';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("adminAuthenticated") === "true") {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("adminAuthenticated", "true");
                toast.success("Welcome back, Admin!");
                navigate("/admin/dashboard");
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />

            <div className="relative z-10 w-full max-w-md p-8 glass-card rounded-xl border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="font-cinzel text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-silver-dark">Royal Timepieces Management</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-silver">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@royaltimepieces.com"
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-silver"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-silver">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-silver"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-silver text-black hover:bg-silver-light font-semibold transition-all duration-300"
                    >
                        Access Dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

