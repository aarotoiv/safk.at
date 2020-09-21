import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';
import Loader from '../../components/loader';

const Menu = () => {
    const [ data, setData ] = useState({ headers: [], everything: [] });
    const [ loading, setLoading ] = useState(true);

    useEffect(async () => {
        const { data } = await axios(process.env.NODE_ENV === "production" ? '/api/menu' : 'http://localhost:5000/api/menu');
        setData(data);
        setLoading(false);
    }, [ setData, setLoading ]);

    if (loading)
        return <Loader />;
    else if (data.length > 0) {
        return (
            <div class={style.menu}>
                <div class={style.container}>
                    {
                        data.map(mealOption => {
                            return (
                                <div class={style.mealOption}>
                                    <span class={style.header}>{ mealOption.header }</span>
                                    {
                                        mealOption.items.map(item => {
                                            return <span class={style.item}>{ item }</span>
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    } else
        return <span class={style.noMenu}>No menu available.</span>;
};

export default Menu;