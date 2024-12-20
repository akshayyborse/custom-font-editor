'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { roboto, playfair, dancingScript } from '@/app/fonts'
import { toPng } from 'html-to-image'
import ImageEditor from './ImageEditor'

type FontOptions = {
  family: string
  size: number
  weight: number
  text: string
}

type CustomFont = {
  name: string
  family: string
}

export default function FontGenerator() {
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([])
  const previewRef = useRef<HTMLDivElement>(null)
  
  const defaultFonts = [
    { name: 'Roboto', value: 'var(--font-roboto)' },
    { name: 'Playfair Display', value: 'var(--font-playfair)' },
    { name: 'Dancing Script', value: 'var(--font-dancing)' }
  ]

  const [fontOptions, setFontOptions] = useState<FontOptions>({
    family: defaultFonts[0].value,
    size: 24,
    weight: 400,
    text: 'Type your text here...'
  })

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fontName = file.name.replace(/\.[^/.]+$/, "") // Remove file extension
      const fontUrl = URL.createObjectURL(file)
      
      // Create and load the font
      const fontFace = new FontFace(fontName, `url(${fontUrl})`)
      
      try {
        const loadedFont = await fontFace.load()
        document.fonts.add(loadedFont)
        
        // Add to custom fonts list
        setCustomFonts(prev => [...prev, {
          name: fontName,
          family: fontName
        }])
        
        // Automatically select the new font
        setFontOptions({
          ...fontOptions,
          family: fontName
        })
      } catch (error) {
        console.error('Error loading font:', error)
      }
    }
  }

  // Combine default and custom fonts for the dropdown
  const allFonts = [
    ...defaultFonts,
    ...customFonts.map(font => ({
      name: `${font.name} (Uploaded)`,
      value: font.family
    }))
  ]

  const downloadAsImage = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await toPng(previewRef.current, {
          backgroundColor: 'transparent',
          style: {
            background: 'transparent'
          }
        })
        
        // Create download link
        const link = document.createElement('a')
        link.download = `font-preview-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Text Generator */}
        <div className="bg-gray-900 rounded-xl p-6">
          {/* Font Preview */}
          <div className="mb-8 p-6 bg-gray-800 rounded-lg min-h-[200px] flex items-center justify-center">
            <div 
              ref={previewRef}
              className="bg-transparent w-full flex items-center justify-center"
              style={{
                minHeight: '150px' // Ensure consistent height for download
              }}
            >
              <p style={{
                fontFamily: fontOptions.family,
                fontSize: `${fontOptions.size}px`,
                fontWeight: fontOptions.weight,
                color: 'white',
                textAlign: 'center',
                width: '100%',
                margin: '0 auto'
              }} className="break-words max-w-3xl">
                {fontOptions.text}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Font Upload */}
              <div className="mb-6">
                <label className="block text-white mb-2">Upload New Font</label>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="w-full text-white bg-gray-800 rounded-md p-2"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-white mb-2">Select Font</label>
                <select 
                  className="w-full bg-gray-800 text-white rounded-md p-2"
                  value={fontOptions.family}
                  onChange={(e) => setFontOptions({...fontOptions, family: e.target.value})}
                >
                  <optgroup label="Default Fonts">
                    {defaultFonts.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </optgroup>
                  {customFonts.length > 0 && (
                    <optgroup label="Uploaded Fonts">
                      {customFonts.map(font => (
                        <option key={font.family} value={font.family}>
                          {font.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Rest of the controls remain the same */}
              <div>
                <label className="block text-white mb-2">
                  Font Size: {fontOptions.size}px
                </label>
                <input 
                  type="range"
                  min="12"
                  max="72"
                  value={fontOptions.size}
                  onChange={(e) => setFontOptions({...fontOptions, size: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Font Weight: {fontOptions.weight}
                </label>
                <input 
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={fontOptions.weight}
                  onChange={(e) => setFontOptions({...fontOptions, weight: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-white mb-2">Your Text</label>
              <textarea
                value={fontOptions.text}
                onChange={(e) => setFontOptions({...fontOptions, text: e.target.value})}
                className="w-full h-32 bg-gray-800 text-white rounded-md p-2"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(fontOptions.text)
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Copy Text
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadAsImage}
              className="px-4 py-2 bg-pink-600 text-white rounded-md"
            >
              Download as Image
            </motion.button>
          </div>
        </div>

        {/* Image Editor */}
        <ImageEditor />
      </div>
    </section>
  )
} 