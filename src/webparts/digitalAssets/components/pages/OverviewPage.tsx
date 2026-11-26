import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from '../DigitalAssets.module.scss';
import { digitalAssets } from '../assetData';
import type { IOverviewPageProps } from '../IDigitalAssetsProps';

export default class OverviewPage extends React.Component<IOverviewPageProps> {
  public render(): React.ReactElement {
    return (
      <div>
        <div className={styles.pageHeading}>          
          <Link className={styles.primaryButton} to="/assets">
            Browse asset library <span aria-hidden="true">→</span>
          </Link>
        </div>

        <section className={styles.stats} aria-label="Asset library summary">
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Assets in library</span>
            <strong className={styles.statValue}>{digitalAssets.length}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Collections</span>
            <strong className={styles.statValue}>4</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Recently updated</span>
            <strong className={styles.statValue}>Today</strong>
          </article>
        </section>

        <section className={styles.contentCard} aria-labelledby="recent-assets-heading">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="recent-assets-heading">Recently added</h2>
              <p>Quick access to the latest items in your workspace.</p>
            </div>
            <Link className={styles.textLink} to="/assets">View all assets</Link>
          </div>
          <ul className={styles.assetList}>
            {digitalAssets.slice(0, 3).map(asset => (
              <li className={styles.assetRow} key={asset.id}>
                <span className={styles.assetIcon} aria-hidden="true">{asset.format}</span>
                <div className={styles.assetRowInfo}>
                  <strong>{asset.title}</strong>
                  <span>{asset.owner} · Updated {asset.updated.toLowerCase()}</span>
                </div>
                <span className={styles.assetCategory}>{asset.category}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}
