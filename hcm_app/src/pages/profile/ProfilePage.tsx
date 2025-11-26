import { PageSpinner } from '@armhr/ui';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import { Profile } from '../../components/profile';
import { useApiData } from '../../hooks/useApiData';
import { paths } from '../../utils/paths';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    data: profile,
    loading,
    error,
  } = useApiData((api) => api.profiles.getUserProfileById(userId!));

  if (!loading && error) {
    navigate(paths.directory);
    return null;
  }

  if (loading || !profile) {
    return <PageSpinner />;
  }

  const displayName = profile.nickname || profile.first_name;

  return (
    <>
      <Helmet>
        <title>
          {displayName} {profile.last_name} | Armhr
        </title>
        <meta
          name="description"
          content={`View ${displayName}'s profile information.`}
        />
      </Helmet>
      <Profile employee={profile} />
    </>
  );
};

export default ProfilePage;
