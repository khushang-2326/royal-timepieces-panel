import API_URL from '@/config';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserData {
    _id: string;
    username: string;
    email: string;
    image?: string;
    createdAt: string;
}

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white font-playfair">Registered Users</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <Card
                        key={user._id}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/orders?user=${user.email}`)}
                    >
                        <CardContent className="flex items-center gap-4 p-4">
                            <Avatar className="h-12 w-12 border border-white/10">
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">{user.username}</h3>
                                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-400">Joined</p>
                                <p className="text-sm font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;

