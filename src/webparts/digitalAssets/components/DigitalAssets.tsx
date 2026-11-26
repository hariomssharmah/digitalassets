import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import styles from './DigitalAssets.module.scss';
import type { IDigitalAssetsProps } from './IDigitalAssetsProps';
import AssetsPage from './pages/AssetsPage';
import Dashboard from './pages/Dashboard';
import Header from './Header';
import NotFoundPage from './pages/NotFoundPage';

export default class DigitalAssets extends React.Component<IDigitalAssetsProps> {
  public render(): React.ReactElement {
    const props = this.props;
    return (
      <HashRouter>
        <div className={styles.digitalAssets}>
          <Header role={props.role} />

          <main className={styles.main}>
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    context={props.context}
                    description={props.description}
                    userDisplayName={props.userDisplayName}
                    role={props.role}
                    roleError={props.roleError}
                  />
                }
              />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <footer className={styles.footer}>{props.environmentMessage}</footer>
          </main>
        </div>
      </HashRouter>
    );
  }
}
