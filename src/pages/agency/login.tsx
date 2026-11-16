import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AgencyLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signin?redirect=/agency/dashboard');
  }, [router]);
  return null;
}
