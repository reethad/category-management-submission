"use client"

import Link from "next/link"
import { ShoppingCart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { Badge } from "@/components/ui/badge"
import { logout } from "@/lib/redux/slices/authSlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isSellerRoute = pathname.startsWith("/seller")
  const cartItems = useAppSelector((state) => state.cart.items)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    await dispatch(logout())
    router.push("/")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          BundleMarket
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/bundles" className="text-sm font-medium transition-colors hover:text-primary">
            Browse Bundles
          </Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="/test-discount" className="text-sm font-medium transition-colors hover:text-primary">
            Test Discount API
          </Link>
          {isAuthenticated && user?.role === "seller" && (
            <Link href="/seller/bundles" className="text-sm font-medium transition-colors hover:text-primary">
              Seller Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
