import BundleForm from "@/components/seller/bundle-form"

export default function EditBundlePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Bundle</h1>
      <BundleForm bundleId={params.id} />
    </div>
  )
}
