import { h } from 'preact';
import { Router } from 'preact-router';
import { useState } from "preact/hooks";

import Nav from './nav';

import Menu from '../routes/menu';
import Schedule from '../routes/schedule';
import Source from '../routes/source';
import Error from '../routes/error';
import Map from '../routes/map'

import SetClassPopup from './setclasspopup';

import preactLocalStorage from 'preact-localstorage';

const App = () => {

	const [ localClassId, setLocalClassId ] = useState("");
	const [ localSourceNav, setLocalSourceNav ] = useState(false);

	setLocalClassId(preactLocalStorage.get('safk-at-preferred-classid', 'group'));
	setLocalSourceNav(preactLocalStorage.get('safk-at-source-nav', 'false'));
	
	return (
		<div id="app">
			<Nav localClassId={localClassId} localSourceNav={localSourceNav} />
			<Router>
				<Menu path="/" />
				<Source path="/source" />
				<SetClassPopup path="/group" setLocalClassId={setLocalClassId} setLocalSourceNav={setLocalSourceNav} />
				<Schedule path="/:classId" />
				<Error type="404" default />
				<Map path="/map" />
			</Router>
		</div>
	);
};

export default App;
