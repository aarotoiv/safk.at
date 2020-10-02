import { h } from 'preact';
import style from './style.css';

const Error = () => (
	<div class={style.notFoundContainer}>
		<h1 style={style.notFound}>404</h1>
	</div>
);

export default Error;