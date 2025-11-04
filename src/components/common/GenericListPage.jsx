'use client';

import { useState } from 'react';
import SectionContainer from '@/components/Office/SectionContainer';

export default function GenericListPage({
  titleKey,
  Controls,
  Table,
  searchPropName = 'searchQuery',
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const tableProps = {
    [searchPropName]: searchQuery,
  };

  return (
    <main>
      <SectionContainer titleKey={titleKey}>
        {Controls && <Controls onSearch={setSearchQuery} />}
        {Table && <Table {...tableProps} />}
      </SectionContainer>
    </main>
  );
}
