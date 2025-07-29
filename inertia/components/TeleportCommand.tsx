import React, { useState } from 'react'

interface TeleportCommandProps {
  x: number
  y: number
  z: number
  dimension: string
  className?: string
}

export default function TeleportCommand({ x, y, z, dimension, className = '' }: TeleportCommandProps) {
  const [copied, setCopied] = useState(false)
  
  // Map the dimension to the Minecraft dimension format
  const minecraftDimension = dimension === 'nether' 
    ? 'the_nether' 
    : dimension === 'end' 
      ? 'the_end' 
      : 'overworld'
  
  // Create the teleport command
  const teleportCommand = `/execute as @p in minecraft:${minecraftDimension} run tp @s ${x} ${y} ${z}`
  
  // Function to copy the command to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(teleportCommand)
      .then(() => {
        setCopied(true)
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }
  
  return (
    <div className={`inline-block relative ${className}`}>
      <span 
        onClick={copyToClipboard}
        className="text-white cursor-pointer hover:underline"
        title="Cliquez pour copier la commande de téléportation"
      >
        X: {x}, Y: {y}, Z: {z}
      </span>
      
      {/* Tooltip that appears when copied */}
      {copied && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          Commande copiée !
        </div>
      )}
    </div>
  )
}