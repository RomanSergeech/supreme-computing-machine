import SectionContainer from '@/components/Office/SectionContainer';
import ApplicationsTable from '@/components/Office/applications/ApplicationsTable';

export default function OverviewPage() {
    return (
        <>
            <main>
                <SectionContainer titleKey="sectionUsedApps">
                  <ApplicationsTable />  
                </SectionContainer>
            </main>
        </>
    );
}

