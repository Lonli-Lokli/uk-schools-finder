import { Button, Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUnit } from 'effector-react';
import { 
  $viewModel, 
  signUpFx, 
  signInFx, 
  usernameChanged,
  modalOpened,
  modalClosed,
  signUpModeToggled
} from './model';

export function AnonymousUser() {
  const vm = useUnit($viewModel);

  return (
    <>
      <Button 
        type="text"
        icon={<UserOutlined />}
        onClick={() => modalOpened()}
        className="text-white hover:text-white/80 hover:!text-white"
      >
        Sign In
      </Button>

      <Modal
        title={vm.isSignUp ? "Sign up with passkey" : "Sign in with passkey"}
        open={vm.isModalOpen}
        onCancel={() => !vm.isLoading && modalClosed()}
        footer={null}
        closable={!vm.isLoading}
        maskClosable={!vm.isLoading}
      >
        {vm.isSignUp ? (
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={vm.username}
              onChange={(e) => usernameChanged(e.target.value)}
              prefix={<UserOutlined />}
              disabled={vm.isLoading}
            />
            <Button 
              type="primary" 
              block 
              onClick={() => signUpFx(vm.username)}
              loading={vm.isLoading}
            >
              Sign up with passkey
            </Button>
            <div className="text-center text-gray-500">
              Already have an account?{' '}
              <Button 
                type="link" 
                onClick={() => signUpModeToggled()}
                disabled={vm.isLoading}
              >
                Sign in
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              type="primary" 
              block 
              onClick={() => signInFx()}
              loading={vm.isLoading}
            >
              Sign in with passkey
            </Button>
            <div className="text-center text-gray-500">
              Don't have an account?{' '}
              <Button 
                type="link" 
                onClick={() => signUpModeToggled()}
                disabled={vm.isLoading}
              >
                Sign up
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
} 