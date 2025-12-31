import { useState, useEffect, useCallback } from 'react';


import { useAuthContext } from '../hooks';
import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { SplashScreen } from '@/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen/> : <Container>{children}</Container>}</>;
}

function Container({ children }: Props) {
  const router = useRouter();

  const { authenticated, loading } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if(loading) return;

    if (!authenticated) {
      router.replace(paths.login())
    } else {
      setChecked(true);
    }
  }, [authenticated, router, loading]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !checked) {
    return null;
  }

  return <>{children}</>;
}
