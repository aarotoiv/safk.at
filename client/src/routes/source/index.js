import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';
import Loader from '../../components/loader';

const Source = () => {

    const [ loading, setLoading ] = useState(true);
    const [ doorOpen, setDoorOpen ] = useState(false);

    useEffect(async () => {
        const sourceData = await axios.get(process.env.NODE_ENV === "production" ? "/api/source" : "http://localhost:5000/api/source");
        setDoorOpen(sourceData.data.doorOpen);
        setLoading(false);
    }, [ setDoorOpen, setLoading ]);

    return (
        <div class={style.container}>
            {
                !loading ? (
                    <>
                        <div class={`${style.door}` + (doorOpen ? ` ${style.open}` : '')}>
                            <div class={`${style.doorInner}`}></div>
                        </div>
                        {
                            doorOpen ? (
                                <p class={style.doorText}>Door is open</p>
                            ) : (
                                <p class={style.doorText}>Door is closed</p>
                            )
                        }
                    </>
                ) : (
                    <Loader />
                )
            }
	    </div>
    );

};

export default Source;