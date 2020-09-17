import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';

const Menu = () => {
    const [ data, setData ] = useState({ headers: [], everything: [] });

    useEffect(async () => {
        const menuData = await axios('http://localhost:5000?json');
        console.log(menuData.data);
        setData(menuData.data);
    }, []);

    return (
        <div class={style.home}>
		    {
                data.headers.map((item) => {
                    return <p>asd</p>
                })
            }
	    </div>
    );
};

export default Menu;