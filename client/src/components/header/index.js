import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Nav = () => (
	<div class={style.navContainer}>
		<div class={style.nav}>
			<Link class={style.navItem} href="/">menu</Link>
			<span class={style.border} />
			<Link class={style.navItem} href="/19tietob">schedule</Link>
			<span class={style.border} />
			<Link class={style.navItem} href="/source">source</Link>
		</div>
	</div>
);

export default Nav;
