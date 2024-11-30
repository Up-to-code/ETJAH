import { Suspense } from 'react';
 
import AccountantDashboard from './AccountantDashboard';

export default async function AccountantPage() {
 

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountantDashboard />
    </Suspense>
  );
}

