import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AgencyRegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signup/agency');
  }, [router]);
  return null;
}
