import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const ProtectedRoute = () => {
    const user = sessionStorage.getItem("user");

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <div className="bg-muted/30 p-8 rounded-2xl border border-border max-w-md w-full backdrop-blur-sm">
                    <div className="w-16 h-16 bg-silver/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-silver" />
                    </div>
                    <h2 className="font-playfair text-2xl font-bold mb-3">Access Restricted</h2>
                    <p className="text-muted-foreground mb-8">
                        You need to be logged in to view this page. Please sign in to access your account details and orders.
                    </p>
                    <Button asChild className="w-full bg-silver text-black hover:bg-silver-light font-semibold">
                        <Link to="/auth">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
