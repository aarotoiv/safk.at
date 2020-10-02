import { h } from 'preact';
import { route } from 'preact-router';
import style from './style.css';
import { Home, Calendar, Code, Settings } from 'preact-feather';

const Nav = ({ localClassId, localSourceNav }) => {
	return (
		<div class={style.navContainer}>
			<div class={style.nav}>
				<button aria-label="Home" type="button" class={style.navItem} onClick={() => route("/")}>
					<Home size={25} />
				</button>
				<button aria-label="Schedule" type="button" class={style.navItem} onClick={() => route(localClassId ? `/${localClassId}` : "/group")}>
					<Calendar size={25} />
				</button>
				{
					localSourceNav != "false" ? (
						<button aria-label="Source" type="button" class={style.navItem} onClick={() => route("/source")}>
							<Code size={25} />
						</button>
					) : <></>
				}
				<button aria-label="Settings" type="button" class={style.navItem} onClick={() => route("/group")}>
					<Settings size={25} />
				</button>
			</div>
		</div>
	);
};

export default Nav;
