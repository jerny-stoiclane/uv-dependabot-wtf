/**
 * Checks if the current user is proxying into someone based on their sub property
 * @param user - The user object from useUser hook
 * @returns true if the user is proxying, false otherwise
 */
export const isProxying = (user: Auth0User | null): boolean => {
  if (!user) return false;
  // Check if user has a sub property that starts with 'okta|' or 'armhr|'
  const sub = user.sub;
  if (!sub || typeof sub !== 'string') return false;

  return sub.startsWith('okta|') || sub.startsWith('armhr|');
};

/**
 * Gets the proxy block message for display in modals
 * @returns A user-friendly message explaining why the action is blocked
 */
export const getProxyBlockMessage = (): string => {
  return 'This action is not allowed while proxying into another user. Please end the proxy session to perform this action.';
};
