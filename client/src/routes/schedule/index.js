import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import axios from 'axios';
import style from './style.css';
import Loader from '../../components/loader';
import { route } from 'preact-router';
import preactLocalStorage from 'preact-localstorage';

const Schedule = ({ classId }) => {

    const [ schedule, setSchedule ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ touchStartX, setTouchStartX ] = useState(-1);

	useEffect(async () => {
        if (!preactLocalStorage.get('safk-at-preferred-classid', false))
            route(`/group/?requestClassId=${classId}`);
        else {
            const scheduleData = await axios.get(process.env.NODE_ENV === "production" ? `/api/${classId}` : `http://localhost:5000/api/${classId}`);
            setSchedule(scheduleData.data);
            setLoading(false);
        }
    }, [ setSchedule, setLoading ]);
    
    const changeActiveIndex = val => {
        if (activeIndex + val > schedule.length - 1) 
            setActiveIndex(schedule.length - 1);
        else if (activeIndex + val < 0)
            setActiveIndex(0);
        else 
            setActiveIndex(activeIndex + val);
    };

    const _onTouchStart = evt => setTouchStartX(evt.touches.length > 0 ? evt.touches[0].pageX : -1);

    const _onTouchEnd = evt => {
        if (touchStartX != -1 && evt.changedTouches.length > 0) {
            const deltaX = evt.changedTouches[0].pageX - touchStartX;
            if (deltaX <= -40) 
                changeActiveIndex(1);
            else if (deltaX >= 40)
                changeActiveIndex(-1);
        }
    };

    if (loading)
        return <Loader />;
    else if (schedule.length > 0) {
        return (
            <div class={style.scheduleContainer}
                onTouchStart={(evt) => _onTouchStart(evt)}
                onTouchEnd={(evt) => _onTouchEnd(evt)}>
                <button class={`${style.schedNavButton} ${style.goLeft}` + (activeIndex <= 0 ? ` ${style.hidden}` : '')} 
                    onClick={() => changeActiveIndex(-1)}>
                    <div class={style.goLeftButton}></div>
                </button>
                <button class={`${style.schedNavButton} ${style.goRight}` + (activeIndex >= (schedule.length - 1) ? ` ${style.hidden}` : '')} 
                    onClick={() => changeActiveIndex(1)}>
                    <div class={style.goRightButton}></div>
                </button>
                {
                    schedule.map((day, i) => {
                        return <ScheduleDay day={day} fullScreenActive={i >= activeIndex && i < activeIndex + 5} active={i == activeIndex} />
                    })
                }
            </div>
        );
    } else {
        return <span class={style.noSched}>Request timed out. Did you use a correct class id?</span>
    }
}

const ScheduleDay = ({ day, active, fullScreenActive }) => {
    return (
        <div class={`${style.scheduleBlock}` + (active ? ` ${style.active}` : '') + (fullScreenActive ? ` ${style.fullScreenActive}`: '')}>
            <p class={style.blockWeekday}>
                { day.weekDay }
            </p>
            <p class={style.blockDate}>
                { day.day }
            </p>
            {day.events.map(evt => {
                return (
                    <div class={style.blockEvent}>
                        <p class={style.eventTime}>
                            {evt.startTime} - {evt.endTime}
                        </p>
                        {evt.info.map(info => {
                            return (
                                <p class={style.eventInfoLine}>
                                    { info }
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Schedule;
