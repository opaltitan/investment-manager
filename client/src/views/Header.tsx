import { Link } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const linkData = [
    { id: 1, display: 'Dashboard', link: '/', className: 'nav_item' },
    { id: 2, display: 'Search', link: '/search', className: 'nav_item' }
  ];

  const links = linkData.map((item) => {
    return (
      <li key={item.id}
          className={item.className}>
        <Link to={item.link}>
          <h4>{item.display}</h4>
        </Link>
      </li>
    );
  });

  return (
    <header className="navbar">
      <nav>
        <ul>{links}</ul>
      </nav>
    </header>
  );
};
