import { h } from 'preact';
import { route } from 'preact-router';
import style from './style.css';
import { Home, Calendar, Code, Settings } from 'preact-feather';

const Nav = ({ localClassId, localSourceNav }) => {

	return (
		<div class={style.navContainer}>
			<div class={style.nav}>
				<button type="button" class={style.navItem} onClick={() => route("/")}>
					<Home size={25} />
				</button>
				<button type="button" class={style.navItem} onClick={() => route(localClassId ? `/${localClassId}` : "/group")}>
					<Calendar size={25} />
				</button>
				{
					localSourceNav ? (
						<button type="button" class={style.navItem} onClick={() => route("/source")}>
							<Code size={25} />
						</button>
					) : <></>
				}
				<button type="button" class={style.navItem} onClick={() => route("/group")}>
					<Settings size={25} />
				</button>
			</div>
		</div>
	);
};

export default Nav;
