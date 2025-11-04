'use client'

import SectionContainer from '@/components/Office/SectionContainer';
import WebsitesTable from '@/components/Office/websites/WebsitesTable';


export default function WebsitesPage() {
    return (
        <>
            <main>
                <SectionContainer titleKey="sectionVisitedSites">
                    <WebsitesTable />
                </SectionContainer>
            </main>
        </>
    );
}

