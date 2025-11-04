import OfficeSettings from '@/components/Office/settings/OfficeSettings';
import styles from './SettingsPage.module.css'; // создаёшь рядом

export default function SettingsPage() {
    return (
        <main className={styles.main}>
            <OfficeSettings />
        </main>
    );
}

