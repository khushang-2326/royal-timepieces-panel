import API_URL from '@/config';
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface Product {
    _id: string;
    name: string;
    brand: string;
    price: string;
    category: string;
    stock: number;
    image: string;
    description: string;
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", brand: "", price: "", category: "", stock: "", image: "", description: "" });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (isEdit && editingProduct) {
                    setEditingProduct({ ...editingProduct, image: base64String });
                } else {
                    setNewProduct({ ...newProduct, image: base64String });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newProduct.name,
                    brand: newProduct.brand,
                    price: newProduct.price,
                    category: newProduct.category,
                    stock: parseInt(newProduct.stock) || 0,
                    image: newProduct.image,
                    description: newProduct.description,
                }),
            });

            if (response.ok) {
                toast.success("Product added successfully");
                fetchProducts();
                setIsAddOpen(false);
                setNewProduct({ name: "", brand: "", price: "", category: "", stock: "", image: "", description: "" });
            } else {
                toast.error("Failed to add product");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Error adding product");
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsEditOpen(true);
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        try {
            const response = await fetch(`${API_URL}/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editingProduct.name,
                    brand: editingProduct.brand,
                    price: editingProduct.price,
                    category: editingProduct.category,
                    stock: editingProduct.stock,
                    image: editingProduct.image,
                    description: editingProduct.description,
                }),
            });

            if (response.ok) {
                toast.success("Product updated successfully");
                fetchProducts();
                setIsEditOpen(false);
                setEditingProduct(null);
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Error updating product");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Error deleting product");
        }
    };

    const getStockColor = (stock: number) => {
        if (stock < 4) return "bg-red-500";
        if (stock < 7) return "bg-blue-500";
        return "bg-green-500";
    };

    const getStockTextColor = (stock: number) => {
        if (stock < 4) return "text-red-500";
        if (stock < 7) return "text-blue-500";
        return "text-green-500";
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white font-playfair">Manage Watches</h2>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-silver text-black hover:bg-silver-light">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Watch
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Watch</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new timepiece.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="brand" className="text-right">Brand</Label>
                                <Input
                                    id="brand"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input
                                    id="price"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input
                                    id="category"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">Image</Label>
                                <div className="col-span-3 flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={(e) => handleImageChange(e)}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white/5 border-white/10 hover:bg-white/10"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Image
                                    </Button>
                                    {newProduct.image && (
                                        <img src={newProduct.image} alt="Preview" className="h-10 w-10 object-cover rounded" />
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea
                                    id="description"
                                    className="col-span-3 bg-white/5 border-white/10"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddProduct} className="bg-silver text-black hover:bg-silver-light">
                                Save Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Watch</DialogTitle>
                            <DialogDescription>
                                Update the details of the timepiece.
                            </DialogDescription>
                        </DialogHeader>
                        {editingProduct && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                                    <Input
                                        id="edit-name"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-brand" className="text-right">Brand</Label>
                                    <Input
                                        id="edit-brand"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.brand || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-price" className="text-right">Price</Label>
                                    <Input
                                        id="edit-price"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-category" className="text-right">Category</Label>
                                    <Input
                                        id="edit-category"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.category}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-stock" className="text-right">Stock</Label>
                                    <Input
                                        id="edit-stock"
                                        type="number"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.stock}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-image" className="text-right">Image</Label>
                                    <div className="col-span-3 flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={editFileInputRef}
                                            onChange={(e) => handleImageChange(e, true)}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-white/5 border-white/10 hover:bg-white/10"
                                            onClick={() => editFileInputRef.current?.click()}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </Button>
                                        {editingProduct.image && (
                                            <img src={editingProduct.image} alt="Preview" className="h-10 w-10 object-cover rounded" />
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-description" className="text-right">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        className="col-span-3 bg-white/5 border-white/10"
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={handleUpdateProduct} className="bg-silver text-black hover:bg-silver-light">
                                Update Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-white/10 bg-white/5">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-400">Name</TableHead>
                            <TableHead className="text-gray-400">Brand</TableHead>
                            <TableHead className="text-gray-400">Price</TableHead>
                            <TableHead className="text-gray-400 w-[200px]">Stock</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id} className="border-white/10 hover:bg-white/5 text-white">
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs">
                                            <span className={`${getStockTextColor(product.stock)} font-bold`}>
                                                {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.min(product.stock * 10, 100)}
                                            className="h-2 bg-white/10"
                                            indicatorClassName={getStockColor(product.stock)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2 items-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-silver hover:bg-white/10"
                                            onClick={() => handleEditClick(product)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-red-500 hover:bg-red-900/20"
                                            onClick={() => handleDelete(product._id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminProducts;

