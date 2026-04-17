"use client"

import Image from "next/image"
import { ImagePlus, Trash } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  disabled?: boolean
  value: { url: string }[]
  onAdd: (image: { url: string }) => void
  onRemove: (url: string) => void
}

export default function ImageUpload({
  disabled,
  value,
  onAdd,
  onRemove,
}: ImageUploadProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((image) => (
          <div key={image.url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(image.url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={image.url} sizes="200px" />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="anarchist"
        onSuccess={(result) => {
          onAdd({ url: (result.info as { secure_url: string }).secure_url })
        }}
      >
        {({ open }) => (
          <Button type="button" disabled={disabled} variant="secondary" onClick={() => open()}>
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload an Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  )
}
