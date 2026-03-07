import React from "react";
import { Button } from "@/components/ui/button";

export default function TestColorsPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Neon Red Color Palette</h1>
        <p className="text-muted-foreground">
          Testing the custom neon-red palette using Tailwind classes.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Backgrounds</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-50 text-black">
              <span className="font-mono text-sm">neon-red-50</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-100 text-black">
              <span className="font-mono text-sm">neon-red-100</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-200 text-black">
              <span className="font-mono text-sm">neon-red-200</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-300 text-black">
              <span className="font-mono text-sm">neon-red-300</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-400 text-black">
              <span className="font-mono text-sm">neon-red-400</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-500 text-white">
              <span className="font-mono text-sm">neon-red-500</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-600 text-white">
              <span className="font-mono text-sm">neon-red-600</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-700 text-white">
              <span className="font-mono text-sm">neon-red-700</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-800 text-white">
              <span className="font-mono text-sm">neon-red-800</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-900 text-white">
              <span className="font-mono text-sm">neon-red-900</span>
            </div>
            <div className="h-24 w-full rounded-md flex items-center justify-center p-2 bg-neon-red-950 text-white">
              <span className="font-mono text-sm">neon-red-950</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Text Colors</h2>
          <div className="flex flex-wrap gap-4 bg-muted p-6 rounded-lg">
            <span className="text-lg font-bold text-neon-red-50">Text 50</span>
            <span className="text-lg font-bold text-neon-red-100">
              Text 100
            </span>
            <span className="text-lg font-bold text-neon-red-200">
              Text 200
            </span>
            <span className="text-lg font-bold text-neon-red-300">
              Text 300
            </span>
            <span className="text-lg font-bold text-neon-red-400">
              Text 400
            </span>
            <span className="text-lg font-bold text-neon-red-500">
              Text 500
            </span>
            <span className="text-lg font-bold text-neon-red-600">
              Text 600
            </span>
            <span className="text-lg font-bold text-neon-red-700">
              Text 700
            </span>
            <span className="text-lg font-bold text-neon-red-800">
              Text 800
            </span>
            <span className="text-lg font-bold text-neon-red-900">
              Text 900
            </span>
            <span className="text-lg font-bold text-neon-red-950">
              Text 950
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-neon-red-50 text-black hover:bg-neon-red-100">
              Button 50
            </Button>
            <Button className="bg-neon-red-100 text-black hover:bg-neon-red-200">
              Button 100
            </Button>
            <Button className="bg-neon-red-200 text-black hover:bg-neon-red-300">
              Button 200
            </Button>
            <Button className="bg-neon-red-300 text-black hover:bg-neon-red-400">
              Button 300
            </Button>
            <Button className="bg-neon-red-400 text-black hover:bg-neon-red-500">
              Button 400
            </Button>
            <Button className="bg-neon-red-500 text-white hover:bg-neon-red-600">
              Button 500
            </Button>
            <Button className="bg-neon-red-600 text-white hover:bg-neon-red-700">
              Button 600
            </Button>
            <Button className="bg-neon-red-700 text-white hover:bg-neon-red-800">
              Button 700
            </Button>
            <Button className="bg-neon-red-800 text-white hover:bg-neon-red-900">
              Button 800
            </Button>
            <Button className="bg-neon-red-900 text-white hover:bg-neon-red-950">
              Button 900
            </Button>
            <Button className="bg-neon-red-950 text-white hover:bg-neon-red-900">
              Button 950
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
