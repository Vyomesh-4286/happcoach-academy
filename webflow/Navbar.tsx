// TEMPORARY placeholder so the project runs before your first DevLink export.
// `npm run devlink` replaces it with your real Webflow "Navbar" component.
export function Navbar() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, height: 72, background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px', fontFamily: 'Arial, sans-serif' }}>
      <strong style={{ fontSize: 28, color: '#fff' }}><span style={{ color: '#ffcc00' }}>happ</span>coach</strong>
      <span style={{ color: '#777', fontSize: 13 }}>Placeholder — run “npm run devlink”</span>
    </header>
  );
}
