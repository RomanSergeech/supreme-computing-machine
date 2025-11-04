'use client';

import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import UserDropdown from './UserDropdown';
import Header from '@/components/common/Header';
import { useState } from 'react';
import DateRangeDropdown from '../common/DateRangeDropdown';
import { useUserStore } from '@/shared/store/user.store'
import { useOfficeStore } from '@/shared/store/office.store'

export default function OfficeHeader() {

  const userStore = useUserStore(state => state)

  const [range, setRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
      from: undefined,
      to: undefined,
  });

  const user = {
    name: userStore.u_name,
    email: userStore.u_email,
    initials: userStore.u_name.slice(0, 1).toLocaleUpperCase() + userStore.u_family?.slice(0, 1).toLocaleUpperCase(),
    avatar: userStore.u_photo || ''
  };

  const chooseEventsRange = ({ from, to }: { from: Date | undefined, to: Date | undefined }) => {
    useOfficeStore.setState({ queryEvents: {
      start: from,
      end: to
    } })
    if ( from && to ) {
      useOfficeStore.getState().getOverviewData()
    }
    setRange({from,to})
  }

  return (
    <Header logoLink="/">
      <DateRangeDropdown dateRange={range} onDateRangeChange={chooseEventsRange} />
      <LanguageSwitcher />
      <UserDropdown user={userStore} />
    </Header>
  );
}
