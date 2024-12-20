'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { roboto, playfair, dancingScript } from '@/app/fonts'

type TextLayer = {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
  weight: number
  opacity: number
}

type CustomFont = {
  name: string
  family: string
}

export default function ImageEditor() {
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [textLayers, setTextLayers] = useState<TextLayer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([])
  const editorRef = useRef<HTMLDivElement>(null)

  const defaultFonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    
    { name: 'Pacifico', value: 'Pacifico, cursive' },
    { name: 'Lobster', value: 'Lobster, cursive' },
    { name: 'Dancing Script', value: 'Dancing Script, cursive' },
    
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Fira Code', value: 'Fira Code, monospace' },
    
    { name: 'Songster', value: 'Songster' },
    { name: 'Millgrove', value: 'Millgrove' },
    { name: 'Hailen', value: 'Hailen' },
    { name: 'Zaft', value: 'Zaft' },
    { name: 'Balgin', value: 'Balgin' },
    { name: 'Pitch Sans', value: 'Pitch Sans' },
    { name: 'Cal Sans', value: 'Cal Sans' },
    { name: 'Cygre', value: 'Cygre' },
    { name: 'Questrail', value: 'Questrail' },
    { name: 'Gendy', value: 'Gendy' },
    { name: 'Givoniq', value: 'Givoniq' }
  ]

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fontName = file.name.replace(/\.[^/.]+$/, "")
      const fontUrl = URL.createObjectURL(file)
      
      const fontFace = new FontFace(fontName, `url(${fontUrl})`)
      try {
        const loadedFont = await fontFace.load()
        document.fonts.add(loadedFont)
        setCustomFonts(prev => [...prev, {
          name: fontName,
          family: fontName
        }])
      } catch (error) {
        console.error('Error loading font:', error)
      }
    }
  }

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: defaultFonts[0].value,
      color: '#ffffff',
      rotation: 0,
      weight: 400,
      opacity: 1
    }
    setTextLayers([...textLayers, newLayer])
    setSelectedLayer(newLayer.id)
  }

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(layers =>
      layers.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    )
  }

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const layer = textLayers.find(l => l.id === id)
    if (layer) {
      setIsDragging(true)
      setSelectedLayer(id)
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedLayer && editorRef.current) {
      const editorRect = editorRef.current.getBoundingClientRect()
      const x = Math.min(
        Math.max(0, e.clientX - editorRect.left - dragOffset.x),
        editorRect.width
      )
      const y = Math.min(
        Math.max(0, e.clientY - editorRect.top - dragOffset.y),
        editorRect.height
      )
      updateLayer(selectedLayer, { x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const downloadImage = async () => {
    if (editorRef.current) {
      try {
        const dataUrl = await toPng(editorRef.current, {
          backgroundColor: 'transparent'
        })
        const link = document.createElement('a')
        link.download = `edited-image-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    }
  }

  // Combine default and custom fonts
  const allFonts = [
    ...defaultFonts,
    ...customFonts.map(font => ({
      name: `${font.name} (Uploaded)`,
      value: font.family
    }))
  ]

  return (
    <div id="image-editor" className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl scroll-mt-20">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Custom Font Image Editor
        </span>
        <span className="ml-4 text-sm bg-purple-600 px-3 py-1 rounded-full">Pro</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        {/* Controls Panel */}
        <div className="space-y-6 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="relative group">
              <label className="block text-white mb-2 font-medium">Upload Font</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="w-full text-white bg-gray-700/50 rounded-lg p-3 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-white mb-2 font-medium">Upload Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setBackgroundImage(e.target?.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full text-white bg-gray-700/50 rounded-lg p-3 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addTextLayer}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/20 transition-shadow"
          >
            + Add Text Layer
          </motion.button>

          {selectedLayer && (
            <div className="space-y-5 mt-6 p-5 bg-gray-800/80 rounded-xl border border-gray-700">
              <h3 className="text-white font-bold flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Layer Settings
              </h3>
              
              {/* Font Family */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Font Family</label>
                <select 
                  className="w-full bg-gray-700/50 text-white rounded-lg p-2.5 border border-gray-600 focus:border-purple-500 transition-colors"
                  value={textLayers.find(l => l.id === selectedLayer)?.fontFamily}
                  onChange={(e) => updateLayer(selectedLayer, { fontFamily: e.target.value })}
                >
                  <optgroup label="Sans-serif Fonts">
                    {defaultFonts.slice(0, 6).map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="Serif Fonts">
                    {defaultFonts.slice(6, 10).map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="Display Fonts">
                    {defaultFonts.slice(10, 13).map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="Monospace Fonts">
                    {defaultFonts.slice(13, 15).map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="Custom Fonts">
                    {defaultFonts.slice(15).map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
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

              {/* Sliders with better styling */}
              <div className="space-y-4">
                {/* Font Size */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium flex justify-between">
                    <span>Size</span>
                    <span className="text-purple-400">
                      {textLayers.find(l => l.id === selectedLayer)?.fontSize}px
                    </span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={textLayers.find(l => l.id === selectedLayer)?.fontSize}
                    onChange={(e) => updateLayer(selectedLayer, { fontSize: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Opacity Control */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium flex justify-between">
                    <span>Opacity</span>
                    <span className="text-purple-400">
                      {Math.round(textLayers.find(l => l.id === selectedLayer)?.opacity * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={textLayers.find(l => l.id === selectedLayer)?.opacity}
                    onChange={(e) => updateLayer(selectedLayer, { opacity: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Weight Control */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium flex justify-between">
                    <span>Weight</span>
                    <span className="text-purple-400">
                      {textLayers.find(l => l.id === selectedLayer)?.weight}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="900"
                    step="100"
                    value={textLayers.find(l => l.id === selectedLayer)?.weight}
                    onChange={(e) => updateLayer(selectedLayer, { weight: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Rotation Control */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium flex justify-between">
                    <span>Rotation</span>
                    <span className="text-purple-400">
                      {textLayers.find(l => l.id === selectedLayer)?.rotation}°
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={textLayers.find(l => l.id === selectedLayer)?.rotation}
                    onChange={(e) => updateLayer(selectedLayer, { rotation: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Color Control */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Color</label>
                  <input
                    type="color"
                    value={textLayers.find(l => l.id === selectedLayer)?.color}
                    onChange={(e) => updateLayer(selectedLayer, { color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="space-y-4">
          <div 
            ref={editorRef}
            className="relative w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700"
            style={{ 
              height: '600px',
              maxHeight: '80vh'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {!backgroundImage && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p className="text-center">
                  <span className="block text-3xl mb-2">📸</span>
                  Upload an image to get started
                </p>
              </div>
            )}
            
            {backgroundImage && (
              <img
                src={backgroundImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            
            {textLayers.map(layer => (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer.id)}
                className={`absolute cursor-move ${selectedLayer === layer.id ? 'ring-2 ring-purple-500' : ''}`}
                style={{
                  left: `${layer.x}px`,
                  top: `${layer.y}px`,
                  transform: `rotate(${layer.rotation}deg)`,
                  zIndex: selectedLayer === layer.id ? 10 : 1,
                  opacity: layer.opacity,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateLayer(layer.id, { text: e.currentTarget.textContent || '' })}
                  style={{
                    fontSize: `${layer.fontSize}px`,
                    fontFamily: layer.fontFamily,
                    fontWeight: layer.weight,
                    color: layer.color,
                    whiteSpace: 'nowrap',
                    userSelect: 'none'
                  }}
                  className="outline-none px-2 py-1"
                >
                  {layer.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {textLayers.length} layer{textLayers.length !== 1 ? 's' : ''}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadImage}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/20 transition-shadow flex items-center"
            >
              <span className="mr-2">Download Image</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
} 