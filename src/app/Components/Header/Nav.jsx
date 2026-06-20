import Link from 'next/link';
import DropDown from './DropDown';

export default function Nav({ setMobileToggle }) {
  return (
    <ul className="cs_nav_list fw-medium">
      <li>
        <Link href="/" onClick={() => setMobileToggle(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/about" onClick={() => setMobileToggle(false)}>
          About
        </Link>
      </li>
      <li>
        <Link href="/service" onClick={() => setMobileToggle(false)}>
          Solutions
        </Link>
      </li>
      <li>
        <Link href="/project" onClick={() => setMobileToggle(false)}>
          Case Studies
        </Link>
      </li>
      <li>
        <Link href="/blog" onClick={() => setMobileToggle(false)}>
          Insights
        </Link>
      </li>
      <li>
        <Link href="/contact" onClick={() => setMobileToggle(false)}>
          Contact
        </Link>
      </li>
    </ul>
  );
}