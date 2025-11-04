'use client';

import SectionContainer from '@/components/Office/SectionContainer';
import UserTimelineCard from '@/components/Office/timelines/UserTimelineCard';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';

export default function TimelinesPage() {
  const formatDuration = useFormatDuration();

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  const user1 = {
    name: 'Алексей Иванов',
    totalTime: formatDuration(502),
    activities: [
      {
        name: 'VS Code',
        time: formatDuration(235),
        type: 'app',
        category: 'productive',
      },
      {
        name: 'github.com',
        time: formatDuration(135),
        type: 'website',
        category: 'productive',
      },
      {
        name: 'Chrome',
        time: formatDuration(90),
        type: 'app',
        category: 'neutral',
      },
      {
        name: 'youtube.com',
        time: formatDuration(45),
        type: 'website',
        category: 'distracting',
      },
    ],
  };

  const user2 = {
    name: 'Мария Смирнова',
    totalTime: formatDuration(512),
    activities: [
      {
        name: 'VS Code',
        time: formatDuration(225),
        type: 'app',
        category: 'productive',
      },
      {
        name: 'github.com',
        time: formatDuration(135),
        type: 'website',
        category: 'productive',
      },
      {
        name: 'Chrome',
        time: formatDuration(90),
        type: 'app',
        category: 'neutral',
      },
      {
        name: 'youtube.com',
        time: formatDuration(62),
        type: 'website',
        category: 'distracting',
      },
    ],
  };

  const user3 = {
    name: 'Иван Кузнецов',
    totalTime: formatDuration(489),
    activities: [
      {
        name: 'VS Code',
        time: formatDuration(210),
        type: 'app',
        category: 'productive',
      },
      {
        name: 'github.com',
        time: formatDuration(135),
        type: 'website',
        category: 'productive',
      },
      {
        name: 'Chrome',
        time: formatDuration(90),
        type: 'app',
        category: 'neutral',
      },
      {
        name: 'youtube.com',
        time: formatDuration(54),
        type: 'website',
        category: 'distracting',
      },
    ],
  };

  const user4 = {
    name: 'Иван Кузнецов',
    totalTime: formatDuration(489),
    activities: [
      {
        name: 'VS Code',
        time: formatDuration(210),
        type: 'app',
        category: 'productive',
      },
      {
        name: 'github.com',
        time: formatDuration(135),
        type: 'website',
        category: 'productive',
      },
      {
        name: 'Chrome',
        time: formatDuration(90),
        type: 'app',
        category: 'neutral',
      },
      {
        name: 'youtube.com',
        time: formatDuration(54),
        type: 'website',
        category: 'distracting',
      },
    ],
  };

  return (
    <main>
      <SectionContainer titleKey="sectionUsersActivity">
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: isMobile
              ? 'none'
              : 'repeat(auto-fill, minmax(300px, 1fr))',
          }}
        >
          <UserTimelineCard user={user1} />
          <UserTimelineCard user={user2} />
          <UserTimelineCard user={user3} />
          <UserTimelineCard user={user4} />
        </div>
      </SectionContainer>
    </main>
  );
}
