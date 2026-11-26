# DigitalAssets

A SharePoint Framework (SPFx) React web part that provides a small single-page digital asset workspace. Navigation uses hash routes so the web part can switch screens without leaving the SharePoint page.

## Toolchain

- Node.js `>=22.14.0 <23.0.0` (tested with Node `22.22.2`)
- SPFx `1.23.2`
- React `17.0.1`
- TypeScript `5.3.x`
- Gulp `4.0.2`

Install dependencies with `npm install`. The generated `package-lock.json` pins the resolved dependency tree.

## Run locally

Run `npx gulp serve` and open the SharePoint hosted workbench. The development certificate and a SharePoint tenant are required for the hosted workbench.

## Use in Microsoft Teams

The web part manifest supports Teams personal apps and Teams tabs. Build the SharePoint app package with `npx gulp bundle --ship` and `npx gulp package-solution --ship`, then upload `sharepoint/solution/digital-assets.sppkg` to your tenant's SharePoint app catalog. Enable the app for Teams in the app catalog when prompted, and have your Teams administrator allow or sync the app if required by your organization's app policies. Users can then add DigitalAssets as a tab where SharePoint Framework apps are available.

## Full-width SharePoint sections

The web part declares `supportsFullBleed` and its layout expands to the width provided by its host. Add it to a full-width section on a modern SharePoint page to use the available page width.

## Build and package

```powershell
npx gulp clean
npx gulp bundle --ship
npx gulp package-solution --ship
```

The SharePoint app package is written to `sharepoint/solution`.

## App routes

- `#/` — role-aware dashboard with asset and task insights
- `#/assets` — searchable asset library

The Dashboard resolves the current user's role from SharePoint group membership. The group names are defined in `src/webparts/digitalAssets/components/roleGroups.ts`; the Reader role uses the current site's associated Visitors (Readers) group. If a user belongs to multiple role groups, the explicit workspace roles take precedence over Reader, with Administrator taking precedence over the other workspace roles.

Asset and task entries shown on the Dashboard are demonstration data. New Asset submissions are held in page memory only. Connect the Dashboard and asset library to the intended SharePoint lists or library before using them as production data.