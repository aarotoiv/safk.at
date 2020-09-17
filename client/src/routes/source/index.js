import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';

const Source = () => {

    const [ loading, setLoading ] = useState(true);
    const [ doorOpen, setDoorOpen ] = useState(false);

    useEffect(async () => {
        const sourceData = await axios.get("http://localhost:5000/source?json");
        setDoorOpen(sourceData.data.doorOpen);
        setLoading(false);
    }, []);

    return (
        <div class={style.container}>
		    <div class={`${style.door}` + (doorOpen ? `${style.open}` : '')}>
                <div class={`${style.doorInner}`}></div>
            </div>
            <p class={style.doorText}>
                { 
                    loading ? (
                        "Loading.."
                    ) : doorOpen ? (
                        "Door is open"
                    ) : (
                        "Door is closed"
                    )
                }
            </p>
	    </div>
    );

};

export default Source;