"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ImageDropzoneProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
}

export function ImageDropzone({ onFilesChange, maxFiles = 5 }: ImageDropzoneProps) {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])

  React.useEffect(() => {
    onFilesChange(previews.map(p => p.file))
  }, [previews, onFilesChange])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles))
  }, [maxFiles])

  const removeFile = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles
  })

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          relative border-2 border-dashed rounded-3xl p-10 
          flex flex-col items-center justify-center text-center 
          transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
            : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-zinc-500"}`} />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
            Görselleri buraya sürükleyin
          </p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            veya dosya seçmek için tıklayın
          </p>
        </div>
        
        <p className="mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
          PNG, JPG, WEBP • Max {maxFiles} Dosya
        </p>

        {isDragActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/10 rounded-3xl flex items-center justify-center backdrop-blur-[2px]"
          >
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-4 py-2 rounded-xl shadow-xl border border-primary/20">
              <ImageIcon className="h-4 w-4 text-primary animate-bounce" />
              <span className="text-xs font-bold text-primary uppercase">Bırakın ve Yükleyin</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        <AnimatePresence>
          {previews.map((preview, index) => (
            <motion.div 
              key={preview.preview}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <Image 
                src={preview.preview} 
                alt="Önizleme" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase rounded-md shadow-lg">
                  Kapak
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
