import { h } from 'preact';
import { Router } from 'preact-router';

import Menu from '../routes/menu';
import Schedule from '../routes/schedule';
import Source from '../routes/source';
import Error from '../routes/error';

const App = () => (
	<div id="app">
		<Router>
			<Menu path="/" />
			<Source path="/source" />
			<Schedule path="/:classId" />
			<Error type="404" default />
		</Router>
	</div>
)

export default App;
