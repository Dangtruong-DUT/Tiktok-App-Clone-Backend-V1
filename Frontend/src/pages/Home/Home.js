import { useState, useEffect, useRef, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import { getUserVideos } from "@/services/userService";
import { RecommendVideo } from "./Components/RecommendVideo";
import { NavigatorVideo } from "../../components/NavigatorVideo";

const cx = classNames.bind(styles);

function Home() {
    const [videos, setVideos] = useState([]);
    const [indexVideo, setIndexVideo] = useState(0);
    const videoContainerRef = useRef(null);
    const videoRefs = useRef([]);
    const isThrottled = useRef(false);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await getUserVideos("@ddt");
            if (response) setVideos(response.data.videos || []);
        };
        fetchVideos();
    }, []);

    const handleScroll = useCallback(
        (e) => {
            if (isThrottled.current) return;
            const threshold = 50;
            if (Math.abs(e.deltaY) < threshold) return;

            isThrottled.current = true;
            setIndexVideo((prev) => {
                const newIndex = e.deltaY > 0 ? Math.min(prev + 1, videos.length - 1) : Math.max(prev - 1, 0);

                videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
                return newIndex;
            });

            setTimeout(() => {
                isThrottled.current = false;
            }, 500);
        },
        [videos]
    );

    const handleChangePrevVideo = useCallback(() => {
        setIndexVideo((prev) => Math.max(prev - 1, 0));
        videoRefs.current[indexVideo - 1]?.scrollIntoView({ behavior: "smooth" });
    }, [indexVideo]);

    const handleChangeNextVideo = useCallback(() => {
        setIndexVideo((prev) => Math.min(prev + 1, videos.length - 1));
        videoRefs.current[indexVideo + 1]?.scrollIntoView({ behavior: "smooth" });
    }, [indexVideo]);

    return (
        <div className={cx("wrapper")} ref={videoContainerRef}>
            <RecommendVideo videos={videos} videoRefs={videoRefs} onWheel={handleScroll} />
            <NavigatorVideo
                className={cx("hiddenOnMobile")}
                index={indexVideo}
                handleClickPrevBtn={handleChangePrevVideo}
                handleClickNextBtn={handleChangeNextVideo}
            />
        </div>
    );
}

export default Home;
