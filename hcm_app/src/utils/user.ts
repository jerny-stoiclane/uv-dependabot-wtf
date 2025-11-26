export const isUnfinishedQuickhire = (
  auth0User: Auth0User | undefined | null
) => {
  return (
    auth0User?.user_metadata?.streamlined_quickhire &&
    auth0User?.user_metadata?.prehire === undefined
  );
};
