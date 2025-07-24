import React from 'react'
import { Head } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps } from '@/types'

export default function TestReset({ flash }: PageProps) {
  return (
    <Layout>
      <Head title="Test Reset Password" />
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Test Reset Password</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <p className="mb-4">
            This is a test page to verify that the reset-password route is working correctly.
          </p>
          
          <div className="mt-4">
            <a 
              href="/reset-password?token=test-token" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition block text-center"
            >
              Test Reset Password Link
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}