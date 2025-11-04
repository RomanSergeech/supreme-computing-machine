'use client';

import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileTabs from '@/components/Profile/ProfileTabs';
import ProfileOverview from '@/components/Profile/overview/ProfileOverview';
import ProfileSubscription from '@/components/Profile/subscription/ProfileSubscription';
import ProfileSettings from '@/components/Profile/settings/ProfileSettings';
import styles from '@/components/Office/SectionContainer.module.css';
import { TTab } from '@/shared/types/profile.types'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { useEffect } from 'react'
import { useUserStore } from '@/shared/store/user.store'


const tabComponents = {
  profile: ProfileOverview,
  subscription: ProfileSubscription,
  settings: ProfileSettings,
};

export default function ProfilePage() {

  useEffect(() => {
    useUserStore.getState().getUserSubscription()
  }, [])

  return (
    <PrivateRoute>
      <ProfileHeader />
      <ProfileTabs>
        {({ activeTab }: { activeTab: TTab['value'] }) => {
          const Component = tabComponents[activeTab]
          return (
            <div className={styles.mainContent}>
              <Component />
            </div>
          );
        }}
      </ProfileTabs>
    </PrivateRoute>
  );
}
