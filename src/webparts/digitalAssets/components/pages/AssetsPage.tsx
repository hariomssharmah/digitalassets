import * as React from 'react';
import styles from '../DigitalAssets.module.scss';
import { digitalAssets } from '../assetData';
import type { IAssetsPageState } from '../IDigitalAssetsProps';

export default class AssetsPage extends React.Component<{}, IAssetsPageState> {
  public state: IAssetsPageState = { searchTerm: '' };

  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchTerm: event.currentTarget.value });
  };

  public render(): React.ReactElement {
    const { searchTerm } = this.state;
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredAssets = digitalAssets.filter(asset => {
      const searchableText = `${asset.title} ${asset.category} ${asset.format} ${asset.owner}`.toLowerCase();
      return searchableText.indexOf(normalizedSearchTerm) !== -1;
    });

    return (
      <div>
        <div className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>Your workspace</p>
            <h1>Asset library</h1>
            <p>Browse and find the files your team uses every day.</p>
          </div>
          <input className={styles.searchBox} type="search" aria-label="Search assets" placeholder="Search by name, type, or owner" value={searchTerm} onChange={this.handleSearchChange} />
        </div>

        <section className={styles.assetGrid} aria-label="Assets">
          {filteredAssets.map(asset => (
            <article className={styles.assetCard} key={asset.id}>
              <div className={`${styles.assetCover} ${styles[asset.accent]}`}>
                <span>{asset.format}</span>
                <span>{asset.category}</span>
              </div>
              <div className={styles.assetCardBody}>
                <h2>{asset.title}</h2>
                <p>{asset.owner} · Updated {asset.updated.toLowerCase()}</p>
              </div>
            </article>
          ))}
          {filteredAssets.length === 0 && (
            <p className={styles.emptyState}>No assets match “{searchTerm}”. Try another search.</p>
          )}
        </section>
      </div>
    );
  }
}
