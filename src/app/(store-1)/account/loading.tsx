import React from "react"

export default function AccountLoading() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
          
          {/* Sidebar Skeleton */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-xl p-4 sticky top-24">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="h-3 w-20 bg-gray-100 rounded mb-2" />
                <div className="h-2 w-32 bg-gray-50 rounded" />
              </div>
            </div>
            
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-full bg-gray-50 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Main content Skeleton */}
          <div className="space-y-5 animate-pulse">
            {/* Welcome banner skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
              <div className="h-6 w-48 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-64 bg-gray-50 rounded" />
            </div>

            {/* Stats row skeleton */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100/50 rounded-lg p-4 h-24" />
              ))}
            </div>

            {/* Content area skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
              <div className="flex items-center justify-between mb-6">
                <div className="h-5 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-16 bg-gray-50 rounded" />
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 w-full bg-gray-50 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
