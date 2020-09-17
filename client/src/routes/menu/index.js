import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';

const Menu = () => {
    const [ data, setData ] = useState({ headers: [], everything: [] });
    const [ loading, setLoading ] = useState(true);

    useEffect(async () => {
        const menuData = await axios('http://localhost:5000?json');
        setData(menuData.data);
        setLoading(false);
    }, []);

    if (loading)
        return <></>;
    else if (data.headers.length > 0) {
        return (
            <div class={style.menu}>
                <div class={style.container}>
                    {
                        data.everything.map(item => {
                            if (data.headers.includes(item))
                                return <span class={style.header}>{ item }</span>;
                            else
                                return <span class={style.item}>{ item }</span>
                        })
                    }
                </div>
            </div>
        );
    } else
        <span class={style.noMenu}>No menu available.</span>
};

export default Menu;