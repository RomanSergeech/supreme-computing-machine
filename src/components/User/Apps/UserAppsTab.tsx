'use client';

import GenericListPage from '@/components/common/GenericListPage';
import UserAppsControls from '@/components/User/Apps/UserAppsControls';
import UserAppsTable from '@/components/User/Apps/UserAppsTable';
import { TWorkerStats } from '@/shared/types/office.types'

interface Props {
  user: TWorkerStats
}
export default function UserAppsTab({ user }: Props) {
  return (
    //@ts-ignore
    <GenericListPage
    titleKey="sectionUserApps"
    //@ts-ignore
      Table={(...props) => UserAppsTable({ user })}
    />
  );
}
