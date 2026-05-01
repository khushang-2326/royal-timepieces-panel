import API_URL from '@/config';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    User,
    Shield,
    Bell,
    Palette,
    Camera,
    LogOut,
    ChevronRight,
    Mail,
    Lock,
    Globe,
    AlertTriangle
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState("profile");
    const [userData, setUserData] = useState({
        id: "",
        username: "",
        email: "",
        image: "",
        bio: ""
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Fetch fresh data
            fetch(`${API_URL}/users/${parsed.id}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("Failed to fetch user");
                })
                .then(data => {
                    setUserData({
                        id: data._id,
                        username: data.username,
                        email: data.email,
                        image: data.image || "",
                        bio: data.bio || ""
                    });
                })
                .catch(err => console.error(err));
        }
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!confirmPassword) {
            toast.error("Please enter your current password to save changes");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    image: userData.image,
                    bio: userData.bio,
                    currentPassword: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("user", JSON.stringify({ id: data.user._id, username: data.user.username, email: data.user.email }));
                toast.success("Profile updated successfully");
                setConfirmPassword("");
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwords.new || !passwords.current) {
            toast.error("Please enter both current and new passwords");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: passwords.new,
                    currentPassword: passwords.current
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password changed! Please login with your new password.");
                sessionStorage.removeItem("user");
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${userData.id}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deletePassword })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account deleted successfully");
                sessionStorage.removeItem("user");
                navigate("/auth");
            } else {
                toast.error(data.message || "Failed to delete account");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-2 border-border">
                                    <AvatarImage src={userData.image || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{userData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-playfair font-semibold">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    PNG, JPG up to 10MB
                                </p>
                                <Button variant="outline" size="sm" className="hover:text-silver" onClick={() => fileInputRef.current?.click()}>
                                    Upload New
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="username">Name</Label>
                                <Input
                                    id="username"
                                    value={userData.username}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="pl-10 bg-background/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    placeholder="Tell us a little about yourself"
                                    className="bg-background/50"
                                    value={userData.bio}
                                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2 pt-4">
                                <Label htmlFor="confirm-password" className="text-silver">Confirm Password to Save Changes</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Enter current password"
                                        className="pl-10 bg-background/50 focus:border-silver"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button className="bg-silver text-black hover:bg-silver-light font-semibold" onClick={handleSaveProfile}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                );
            case "account":
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="current-password"
                                            type="password"
                                            className="pl-10 bg-background/50"
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="new-password"
                                            type="password"
                                            className="pl-10 bg-background/50"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button className="mt-2" onClick={handleUpdatePassword}>Update Password</Button>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Security</h3>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-background/30">
                                <div className="space-y-0.5">
                                    <div className="font-medium text-muted-foreground">Two-Factor Authentication (Disabled)</div>
                                    <div className="text-sm text-muted-foreground">
                                        Temporarily unavailable
                                    </div>
                                </div>
                                <Switch disabled />
                            </div>
                        </div>

                        <Separator />

                        <div className="pt-4">
                            <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Delete Account</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-black border border-white/10 text-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                            <AlertTriangle className="h-5 w-5" />
                                            Delete Account
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-400">
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                            <div className="mt-4 space-y-2">
                                                <Label htmlFor="delete-password">Enter your password to confirm</Label>
                                                <Input
                                                    id="delete-password"
                                                    type="password"
                                                    value={deletePassword}
                                                    onChange={(e) => setDeletePassword(e.target.value)}
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-transparent text-white hover:bg-white/10 border-white/10">Cancel</AlertDialogCancel>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                            disabled={!deletePassword}
                                        >
                                            Delete Account
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                );
            case "notifications":
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Email Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Marketing Emails</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive emails about new products and offers
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Order Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive emails about your order status
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </div>
                );


            case "appearance":
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Preferences</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <div className="relative max-w-xs">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input value="English (United States)" readOnly className="pl-10 bg-background/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">


            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <div className="mb-6 px-4">
                            <h1 className="font-playfair text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground text-sm mt-1">Manage your account</p>
                        </div>

                        <nav className="space-y-1">
                            {[
                                { id: "profile", label: "Profile", icon: User },
                                { id: "account", label: "Account", icon: Shield },
                                { id: "notifications", label: "Notifications", icon: Bell },
                                { id: "appearance", label: "Appearance", icon: Palette },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${activeTab === item.id
                                        ? "bg-secondary text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    {activeTab === item.id && (
                                        <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                                    )}
                                </Button>
                            ))}

                            <Separator className="my-4" />

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                    sessionStorage.removeItem("user");
                                    navigate("/auth");
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1">
                        <div className="glass-card rounded-xl p-6 md:p-8 min-h-[500px]">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>


        </div>
    );
};

export default Settings;

