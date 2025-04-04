
/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate the percentage of goal reached
 */
export const calculateProgress = (raised: number, goal: number): number => {
  const percentage = (raised / goal) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};

/**
 * Format date in a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate days left until the end date
 */
export const calculateDaysLeft = (endDateString: string): number => {
  const endDate = new Date(endDateString);
  const today = new Date();
  
  // Reset time portion for accurate day calculation
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds and convert to days
  const differenceInTime = endDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return Math.max(0, differenceInDays); // Ensure it doesn't go negative
};

/**
 * Generate a UPI payment URL
 */
export const generateUPIPaymentURL = (
  payeeName: string,
  payeeVPA: string,
  amount: number,
  transactionNote: string
): string => {
  // The VPA (UPI ID) used in this function
  // In a real application, this would be your actual UPI ID
  const vpa = payeeVPA || 'example@upi';
  
  // Create a UPI intent URL
  const upiURL = new URL('upi://pay');
  
  // Set the required parameters
  upiURL.searchParams.append('pa', vpa); // Payee address (UPI ID)
  upiURL.searchParams.append('pn', payeeName); // Payee name
  upiURL.searchParams.append('am', amount.toString()); // Amount
  upiURL.searchParams.append('cu', 'INR'); // Currency code
  upiURL.searchParams.append('tn', transactionNote); // Transaction note
  
  return upiURL.toString();
};

/**
 * Get time elapsed from now
 */
export const getTimeElapsed = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 29030400) {
    const months = Math.floor(diffInSeconds / 2419200);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 29030400);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};
