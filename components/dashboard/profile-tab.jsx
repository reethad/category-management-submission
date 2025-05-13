"use client"

import { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { updateProfile } from "@/lib/redux/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

export default function ProfileTab() {
  const { user, status } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const [name, setName] = useState(user?.name || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [previewImage, setPreviewImage] = useState(user?.avatar || "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile({ name, avatar: previewImage })).unwrap()
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewImage || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="text-sm text-muted-foreground">Profile Picture</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                  <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => {
                      setAvatar(e.target.value)
                      setPreviewImage(e.target.value)
                    }}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-sm text-muted-foreground">Enter a URL or use the upload button</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Account Type</div>
                <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Account ID</div>
                <div className="text-sm text-muted-foreground">{user.id}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
