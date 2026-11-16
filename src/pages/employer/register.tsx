import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EmployerRegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signup/employer');
  }, [router]);
  return null;
}
