import * as React from 'react';
import styles from './DigitalAssets.module.scss';
import type { IHeaderProps } from './IDigitalAssetsProps';
import type { UserRole } from './roleGroups';

const ROLE_LABELS: { [role in UserRole]: string } = {
  studio: 'Studio',
  assetCoordinator: 'Asset Coordinator',
  editor: 'Editor',
  categoryManager: 'Category Manager',
  reader: 'Reader',
  administrator: 'Administrator'
};

export default class Header extends React.Component<IHeaderProps> {
  public render(): React.ReactElement {
    const { role } = this.props;
    return (
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">DA</span>
          <div>
            <span className={styles.brandName}>Digital Assets</span>
            {role && <span className={styles.brandRole}>{ROLE_LABELS[role]}</span>}
          </div>
        </div>
        {role === 'administrator' && (
          <span className={styles.settingsIcon} role="img" title="Settings" aria-label="Settings">
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16.2 11.3a5.6 5.6 0 000-2.6l1.6-1.3-1.6-2.8-1.9.8a5.6 5.6 0 00-2.2-1.3L11.8 2H8.2l-.3 2.1a5.6 5.6 0 00-2.2 1.3l-1.9-.8-1.6 2.8 1.6 1.3a5.6 5.6 0 000 2.6l-1.6 1.3 1.6 2.8 1.9-.8a5.6 5.6 0 002.2 1.3l.3 2.1h3.6l.3-2.1a5.6 5.6 0 002.2-1.3l1.9.8 1.6-2.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </header>
    );
  }
}
