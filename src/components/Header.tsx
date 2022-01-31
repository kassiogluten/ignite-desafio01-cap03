import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header style={{ padding: "2rem 0" }}>
      <Link href='/'>
        <a>
          <Image src="/Logo.svg" alt="logo" width="239" height="26" />
        </a>
      </Link>
    </header>
  );
}
