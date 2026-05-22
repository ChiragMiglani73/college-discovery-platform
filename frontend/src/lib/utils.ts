export const formatFees = (fees: number): string => {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(1)}L/yr`;
  }
  return `₹${(fees / 1000).toFixed(0)}K/yr`;
};

export const formatPackage = (pkg: number): string => {
  return `${pkg} LPA`;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return "text-emerald-600 bg-emerald-50";
  if (rating >= 4.0) return "text-blue-600 bg-blue-50";
  if (rating >= 3.5) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

export const getTypeColor = (type: string): string => {
  if (type?.includes("Public")) return "bg-blue-100 text-blue-700";
  if (type?.includes("Private")) return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

export const cn = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};
