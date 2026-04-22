/**
 * Modal helpers for once-per-day logic
 */

/**
 * Get today's date as a string in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Check if the modal should be shown based on completion and last dismissed date
 * @param isCompleted - Whether the user has permanently completed the task
 * @param lastDismissedDate - ISO date string of when the modal was last dismissed
 * @returns true if the modal should be shown
 */
export const shouldShowOncePerDayModal = (
  isCompleted: boolean,
  lastDismissedDate: string | null,
): boolean => {
  // If permanently completed, don't show
  if (isCompleted) {
    return false;
  }

  // If never dismissed, show
  if (!lastDismissedDate) {
    return true;
  }

  // Check if the last dismissed date is today
  const today = getTodayDateString();
  const isSameDay = lastDismissedDate === today;

  // Show if it's a different day than last dismissal
  return !isSameDay;
};

/**
 * Get today's date as ISO string for storage
 */
export const getTodayISODate = (): string => {
  return getTodayDateString();
};
