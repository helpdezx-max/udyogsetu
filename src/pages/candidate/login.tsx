import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CandidateLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signin?redirect=/candidate/dashboard');
  }, [router]);
  return null;
}
