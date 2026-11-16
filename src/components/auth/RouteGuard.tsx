import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { UserRoleType } from '../../types/database.types';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRoleType[];
  requireCompanyVerification?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles = [],
  requireCompanyVerification = false,
}) => {
  const router = useRouter();
  const { user, profile, roles, activeRole, isLoading, isConfigured, activeWorkspace } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // 1. Check if Supabase Auth is active
    if (!isConfigured) {
      // In local offline development/demo mode, allow access
      setAuthorized(true);
      return;
    }

    // 2. Unauthenticated check
    if (!user) {
      setAuthorized(false);
      const currentPath = router.asPath;
      router.replace(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // 3. Account suspension check
    if (profile && profile.is_active === false) {
      setAuthorized(false);
      router.replace('/account-suspended');
      return;
    }

    // 4. Role Authorization check
    if (allowedRoles.length > 0) {
      const hasAllowedRole =
        roles.some((r) => allowedRoles.includes(r)) ||
        roles.includes('admin') ||
        (activeRole && allowedRoles.includes(activeRole));

      if (!hasAllowedRole) {
        setAuthorized(false);
        router.replace('/access-denied');
        return;
      }
    }

    // 5. Verification Gate check (for restricted actions like publishing unverified jobs)
    if (requireCompanyVerification && activeWorkspace) {
      if (activeWorkspace.verificationStatus === 'rejected') {
        setAuthorized(false);
        router.replace('/pending-verification');
        return;
      }
    }

    setAuthorized(true);
  }, [user, profile, roles, activeRole, isLoading, isConfigured, allowedRoles, router.asPath, activeWorkspace, requireCompanyVerification]);

  if (isLoading || !authorized) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-industrial-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
