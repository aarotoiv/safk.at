import { useState } from "preact/hooks";
import { route } from 'preact-router';
import style from './style.css';
import preactLocalStorage from 'preact-localstorage';

const SetClassPopup = ({ setLocalClassId, setLocalSourceNav }) => {
    const query = new URLSearchParams(window.location.search);
    const requestClassId = query.get('requestClassId');
    const [ classId, setClassId ] = useState(requestClassId ? requestClassId : "");
    const [ sourceNav, setSourceNav ] = useState(false);

    const _onClick = async () => {
        preactLocalStorage.set('safk-at-preferred-classid', classId);
        preactLocalStorage.set('safk-at-source-nav', sourceNav);
        setLocalClassId(classId);
        setLocalSourceNav(sourceNav);
        route(`/${classId}`);
    };  

    return (
        <div class={style.popUpBack}>
            <div class={style.popUpContainer}>
                <p class={style.popUpTitle}>Set class id</p>
                <p class={style.popUpInfo}>
                    Please set your preferred class id (eg. 19TIETOB). 
                    The class id is saved in your browser's local-storage, and will be used
                    to efficiently fetch the required schedule-data when needed. 
                    You may change the class id whenever you want, in the settings-section.
                </p>
                <input type="text" value={classId} class={style.popUpInput} onChange={(evt) => setClassId(evt.target.value)}/>
                <input type="checkbox" onChange={(evt) => setSourceNav(evt.target.checked)} class={style.check} /><span class={style.checkText}>Add /source to the navigation</span>
                <button class={style.popUpButton} onClick={() => _onClick()}>Save</button>
            </div>
        </div>
    );
};

export default SetClassPopup;