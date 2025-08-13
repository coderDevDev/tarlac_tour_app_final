"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QRCodeDisplayProps {
  url: string
  siteName: string
}

export default function QRCodeDisplay({ url, siteName }: QRCodeDisplayProps) {
  const [QRCode, setQRCode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Dynamically import the QR code library to avoid SSR issues
    import("react-qr-code").then((module) => {
      setQRCode(() => module.default)
      setIsLoading(false)
    })
  }, [])

  const handleDownload = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      // Download the PNG file
      const downloadLink = document.createElement("a")
      downloadLink.download = `${siteName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="p-4 bg-white">
        {QRCode && <QRCode id="qr-code" value={url} size={200} level="H" className="mx-auto" />}
      </Card>
      <Button variant="outline" size="sm" onClick={handleDownload} className="mt-4">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  )
}
