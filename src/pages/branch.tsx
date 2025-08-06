import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BranchView } from 'src/sections/branch';

// ----------------------------------------------------------------------

const metadata = { title: `Şubeler - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <BranchView />
    </>
  );
}