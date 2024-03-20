import Link from 'next/link';

type AppLinkProps = {
  href: string | object;
  children?: any;
  target?: string | undefined;
  rel?: string | undefined;
  onClick?: () => void;
  as?: string;
};

const AppLink = ({ href, as, children, target = undefined, rel = undefined, onClick, ...props }: AppLinkProps) => {
  return (
    <Link as={as} href={href} {...props}>
      <a target={target} onClick={onClick} rel={rel}>
        {children}
      </a>
    </Link>
  );
};

export default AppLink;
