import { useAuthStore } from "@/Stores/auth.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Home = () => {
  const { login, isLoading, isAuthenticated, user } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quick Shop</h1>
      
      {!isAuthenticated ? (
        <div className="space-y-4">
          <p className="text-gray-600">Please login to continue</p>
          <Button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login with Telegram"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800">Welcome!</h2>
            <p className="text-green-600">
              Logged in as: {user?.first_name} {user?.last_name}
            </p>
            {user?.username && (
              <p className="text-green-600">Username: @{user.username}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Products</h3>
              <p className="text-blue-600">Browse our catalog</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Cart</h3>
              <p className="text-purple-600">View your items</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
