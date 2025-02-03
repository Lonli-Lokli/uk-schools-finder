export function getRatingColor(rating: string): string {
  switch (rating.toLowerCase()) {
    case 'outstanding':
      return 'text-green-600';
    case 'good':
      return 'text-blue-600';
    case 'requires improvement':
      return 'text-amber-600';
    case 'inadequate':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
