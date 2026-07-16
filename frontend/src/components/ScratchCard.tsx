import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ChevronRight } from 'lucide-react'

interface ScratchCardProps {
  offer: {
    title: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    tag: string
    couponCode?: string
  }
  onClose: () => void
}

export default function ScratchCard({ offer, onClose }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [scratching, setScratching] = useState(false)
  const isDrawing = useRef(false)

  const discountLabel =
    offer.discountType === 'percentage'
      ? `${offer.discountValue}% OFF`
      : `₹${(offer.discountValue).toLocaleString('en-IN')} OFF`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw scratch layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#1b2b6b')
    grad.addColorStop(1, '#0b1232')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Scratch pattern dots
    ctx.fillStyle = 'rgba(201,168,76,0.08)'
    for (let x = 0; x < canvas.width; x += 20) {
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Scratch here text
    ctx.fillStyle = 'rgba(201,168,76,0.9)'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🎁  SCRATCH TO REVEAL YOUR OFFER', canvas.width / 2, canvas.height / 2 - 8)
    ctx.font = '11px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText('Use your finger or mouse to scratch', canvas.width / 2, canvas.height / 2 + 14)
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function scratch(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 28, 0, Math.PI * 2)
    ctx.fill()
    checkReveal()
  }

  function checkReveal() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++
    }
    const ratio = transparent / (canvas.width * canvas.height)
    if (ratio > 0.45) autoReveal()
  }

  function autoReveal() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setRevealed(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(11,18,50,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-navy-700 border border-gold-400/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>

          {/* Card */}
          <div className="bg-navy-800 border border-gold-400/30 rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-700 to-navy-900 px-6 py-4 flex items-center gap-3 border-b border-gold-400/20">
              <div className="w-9 h-9 rounded-full bg-gold-400/15 flex items-center justify-center">
                <Gift size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-[10px] tracking-[3px] text-gold-400">EXCLUSIVE OFFER</p>
                <p className="text-white font-medium text-sm">{offer.title}</p>
              </div>
            </div>

            {/* Scratch area */}
            <div className="relative mx-6 my-5 rounded overflow-hidden" style={{ height: 160 }}>
              {/* Reveal content underneath */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gold-400/10 to-navy-700/30 rounded">
                {revealed ? (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="text-center px-4"
                  >
                    <p className="text-gold-400 text-4xl font-bold mb-1">{discountLabel}</p>
                    {offer.couponCode && (
                      <>
                        <p className="text-navy-400 text-xs mb-2">Use coupon code</p>
                        <div className="bg-gold-400/15 border border-gold-400/40 rounded px-4 py-1.5 inline-block">
                          <span className="text-gold-400 font-mono font-bold tracking-widest text-sm">
                            {offer.couponCode}
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center opacity-30">
                    <p className="text-gold-400 text-4xl font-bold">{discountLabel}</p>
                  </div>
                )}
              </div>

              {/* Scratch canvas */}
              <canvas
                ref={canvasRef}
                width={340}
                height={160}
                className="absolute inset-0 w-full h-full rounded"
                style={{ cursor: scratching ? 'crosshair' : 'pointer', touchAction: 'none' }}
                onMouseDown={() => { isDrawing.current = true; setScratching(true) }}
                onMouseMove={scratch}
                onMouseUp={() => { isDrawing.current = false; setScratching(false) }}
                onMouseLeave={() => { isDrawing.current = false; setScratching(false) }}
                onTouchStart={(e) => { e.preventDefault(); isDrawing.current = true }}
                onTouchMove={(e) => { e.preventDefault(); scratch(e) }}
                onTouchEnd={() => { isDrawing.current = false }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              {revealed ? (
                <a
                  href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] py-3 rounded-sm transition-colors"
                >
                  USE THIS OFFER <ChevronRight size={14} />
                </a>
              ) : (
                <button
                  onClick={autoReveal}
                  className="w-full text-center text-xs text-navy-500 hover:text-navy-400 transition-colors py-2"
                >
                  Skip — reveal offer
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
