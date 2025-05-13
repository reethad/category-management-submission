"use client"
import { useParams } from "react-router-dom"
import BundleForm from "../../components/seller/BundleForm"

const EditBundlePage = () => {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Bundle</h1>
      <BundleForm bundleId={id} />
    </div>
  )
}

export default EditBundlePage
