import { LogoIcon, SettingIcon } from '@/components/icons';
import { Link } from 'react-router-dom';
import Nav from '@/components/Header/Nav.tsx';
import ConnectButton from '@/components/Wallet/ConnectButton';
import { Button, Popover } from 'antd';
import { useTheme } from '@/components/Theme';
import Lang from '@/components/Lang';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';

const Header = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="py-[20px flex h-[80px] items-center justify-between px-[30px]">
      <Link to="/" className="flex-center gap-[5px]">
        <span className="text-[40px] max-md:text-[30px]">
          <LogoIcon />
        </span>
        <span className="text-[20px] font-bold max-md:hidden">Xunion</span>
      </Link>
      <div
        className={cn(
          'flex  flex-1 items-center px-[60px]',
          'max-md:fixed max-md:bottom-[20px] max-md:left-[20px] max-md:right-[20px]',
          'max-md:h-[48px] max-md:rounded-[10px] max-md:bg-fill-niubi max-md:px-[20px]'
        )}
      >
        <Nav />
      </div>
      <div className="flex-center gap-[20px]">
        <ConnectButton />
        <Popover
          content={
            <div className="flex w-[200px] flex-col gap-[20px]">
              <div className="flex-center-between">
                <span>Theme</span>
                <div className="flex-center gap-[20px]">
                  <Button
                    className="border-0"
                    onClick={() => {
                      setTheme('light');
                    }}
                    icon={<SunOutlined />}
                    type={theme === 'light' ? 'primary' : 'default'}
                  />
                  <Button
                    className="border-0"
                    onClick={() => {
                      setTheme('dark');
                    }}
                    type={theme === 'dark' ? 'primary' : 'default'}
                    icon={<MoonOutlined />}
                  />
                </div>
              </div>
              <div className="flex-center-between">
                <span>Language</span>
                <Lang />
              </div>
            </div>
          }
          trigger={['click']}
          placement="bottomLeft"
          showArrow={false}
        >
          <Button
            icon={<SettingIcon className="cursor-pointer hover:text-theme" />}
            className="border-0"
          />
        </Popover>
      </div>
    </div>
  );
};
export default Header;
