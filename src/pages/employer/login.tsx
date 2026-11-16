import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EmployerLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signin?redirect=/employer/dashboard');
  }, [router]);
  return null;
}
