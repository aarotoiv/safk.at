import { h } from 'preact';
import { route } from 'preact-router';
import style from './style.css';
import { Home, Calendar, Code, Settings, Map } from 'preact-feather';

const Nav = ({ localClassId, localSourceNav }) => {
	return (
		<div class={style.navContainer}>
			<div class={style.nav}>
				<button aria-label="Home" type="button" class={style.navItem} onClick={() => route("/")}>
					<Home size={20} />
				</button>
				<button aria-label="Schedule" type="button" class={style.navItem} onClick={() => route(localClassId ? `/${localClassId}` : "/group")}>
					<Calendar size={20} />
				</button>
				{
					localSourceNav != "false" ? (
						<button aria-label="Source" type="button" class={style.navItem} onClick={() => route("/source")}>
							<Code size={20} />
						</button>
					) : <></>
				}
				<button aria-label="Map" type="button" class={style.navItem} onClick={() => route("/map")}>
					<Map size={20} />
				</button>
				<button aria-label="Settings" type="button" class={style.navItem} onClick={() => route("/group")}>
					<Settings size={20} />
				</button>
			</div>
		</div>
	);
};

export default Nav;
