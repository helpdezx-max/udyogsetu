import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CandidateRegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signup/candidate');
  }, [router]);
  return null;
}
