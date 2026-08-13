"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

interface PriceFilterProps {
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  minPrice?: number
  maxPrice?: number
}

export function PriceFilter({
  priceRange,
  onPriceChange,
  minPrice = 0,
  maxPrice = 5000,
}: PriceFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [localMin, setLocalMin] = useState(priceRange[0].toString())
  const [localMax, setLocalMax] = useState(priceRange[1].toString())

  useEffect(() => {
    setLocalMin(priceRange[0].toString())
    setLocalMax(priceRange[1].toString())
  }, [priceRange])

  const handleSliderChange = (values: number[]) => {
    onPriceChange([values[0], values[1]])
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value)
  }

  const handleMinBlur = () => {
    let value = localMin === "" ? minPrice : Number(localMin)
    if (isNaN(value)) value = minPrice
    if (value < minPrice) value = minPrice
    if (value > priceRange[1]) value = priceRange[1]
    
    if (value !== priceRange[0]) {
      onPriceChange([value, priceRange[1]])
    } else {
      setLocalMin(value.toString())
    }
  }

  const handleMaxBlur = () => {
    let value = localMax === "" ? maxPrice : Number(localMax)
    if (isNaN(value)) value = maxPrice
    if (value > maxPrice) value = maxPrice
    if (value < priceRange[0]) value = priceRange[0]
    
    if (value !== priceRange[1]) {
      onPriceChange([priceRange[0], value])
    } else {
      setLocalMax(value.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'min' | 'max') => {
    if (e.key === 'Enter') {
      type === 'min' ? handleMinBlur() : handleMaxBlur()
    }
  }

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 font-medium"
      >
        Precio
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handleSliderChange}
            min={minPrice}
            max={maxPrice}
            step={10}
            className="w-full"
          />

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={localMin}
                  onChange={handleMinChange}
                  onBlur={handleMinBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'min')}
                  className="pl-7 h-9 text-sm"
                  min={minPrice}
                  max={priceRange[1]}
                />
              </div>
            </div>
            <span className="mt-4 text-muted-foreground">-</span>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={localMax}
                  onChange={handleMaxChange}
                  onBlur={handleMaxBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'max')}
                  className="pl-7 h-9 text-sm"
                  min={priceRange[0]}
                  max={maxPrice}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
