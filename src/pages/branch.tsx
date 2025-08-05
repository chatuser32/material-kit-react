import { Helmet } from 'react-helmet-async';

import { BranchView } from 'src/sections/branch/view';

// ----------------------------------------------------------------------

export default function BranchPage() {
  return (
    <>
      <Helmet>
        <title>Şubeler | Minimal UI</title>
      </Helmet>

      <BranchView />
    </>
  );
}