/**
 * Check if a specific Auth0 feature flag is enabled for a user
 * @param auth0User - The Auth0 user object
 * @param flagName - The name of the feature flag to check
 * @returns boolean indicating if the feature flag is enabled
 */
export const isFeatureFlagEnabled = (
  auth0User: Auth0User | undefined,
  flagName: string
): boolean => {
  if (!auth0User?.hcm_roles) {
    return false;
  }

  return auth0User.hcm_roles.includes(flagName);
};

export const FEATURE_FLAGS = {
  DISABLE_V2_DASHBOARD: 'FeatureFlag_DisableV2Dashboard',
  SWIPE_CLOCK: 'FeatureFlag_SwipeClock',
  ACCESS_REQUEST: 'FeatureFlag_AccessRequest',
  HIRING: 'FeatureFlag_Hiring',
  BONUS_TAX_FORM: 'FeatureFlag_BonusTaxForm',
  PLAN_INFO: 'FeatureFlag_PlanInfo',
} as const;
