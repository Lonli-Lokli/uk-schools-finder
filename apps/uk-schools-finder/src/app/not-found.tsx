import Link from 'next/link';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 max-w-md">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the URL or the page has been moved.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button type="primary" icon={<HomeOutlined />} size="large">
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <div className="animate-bounce">
            <span className="text-6xl">🏫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
