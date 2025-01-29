import { Avatar, Dropdown, Button } from 'antd';
import { signOutClicked } from './model';
import { User } from 'firebase/auth';

const getInitials = (displayName: string | null): string => {
  if (!displayName) return '?';
  return displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface AuthenticatedUserProps {
  user: User;
}
export function AuthenticatedUser({ user }: AuthenticatedUserProps) {
  const items = [
    {
      key: 'info',
      label: (
        <div className="px-4 py-2">
          <div className="font-medium">{user.displayName}</div>
          <div className="text-gray-500 text-sm">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <Button type="text" danger block onClick={() => signOutClicked()}>
          Sign Out
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Avatar size="large" src={user.photoURL} className="cursor-pointer">
        {user.photoURL ? '' : getInitials(user.displayName)}
      </Avatar>
    </Dropdown>
  );
}
