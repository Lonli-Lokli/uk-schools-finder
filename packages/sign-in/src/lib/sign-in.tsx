import { useUnit } from 'effector-react';
import { $user } from './model';
import { AnonymousUser } from './anonymous-user';
import { AuthenticatedUser } from './authenticated-user';

export function SignIn() {
  const user = useUnit($user);
  return user ? <AuthenticatedUser user={user} /> : <AnonymousUser />;
}
