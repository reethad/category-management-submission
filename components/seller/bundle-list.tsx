"use client"

import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchBundles, deleteBundle } from "@/lib/redux/slices/bundlesSlice"
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
} from "@/components/ui/alert-dialog"

export default function BundleList() {
  const dispatch = useAppDispatch()
  const { items: bundles, status, error } = useAppSelector((state) => state.bundles)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBundles())
    }
  }, [status, dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBundle(id)).unwrap()
      toast({
        title: "Bundle deleted",
        description: "The bundle has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bundle. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading bundles...</div>
  }

  if (status === "failed") {
    return <div className="flex justify-center p-8 text-red-500">Error loading bundles: {error}</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bundle Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Discounted Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No bundles found. Create your first bundle to get started.
              </TableCell>
            </TableRow>
          ) : (
            bundles.map((bundle) => (
              <TableRow key={bundle.id}>
                <TableCell className="font-medium">{bundle.name}</TableCell>
                <TableCell>{bundle.products.length} products</TableCell>
                <TableCell>{formatCurrency(bundle.originalPrice)}</TableCell>
                <TableCell>{formatCurrency(bundle.discountedPrice)}</TableCell>
                <TableCell>
                  <Badge variant={bundle.status === "active" ? "default" : "secondary"}>
                    {bundle.status === "active" ? "Active" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/seller/bundles/${bundle.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the bundle.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(bundle.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
