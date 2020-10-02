import style from './style.css';

const Loader = () => {
    return (
        <div class={style.loaderContainer}>
            <div class={style.loader}></div>
            <span class={style.loaderText}>Fetching..</span>
        </div>
    );
};

export default Loader;