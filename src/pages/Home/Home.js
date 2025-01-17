import { useCallback, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from './Home.module.scss';
import { RecommendVideo } from "../Components/RecommendVideo";
import { NavigatorVideo } from "@/pages/Components/NavigatorVideo";
import videos from "@/assets/videos";
import { useDebounce } from "@/hooks";

const cx = classNames.bind(styles);

const dataVideos = [
    {
        avatarUrl: 'https://www.millenniumpost.in/h-upload/2024/08/29/804354-dev-in-khadaan.webp',
        following: false,
        id: 1,
        title: 'Thủ tục trc khi tẩy trang của chị em =)) ',
        author: 'behocbong',
        postedDate: '2024-11-17',
        likes: 274,
        comments: 8,
        save: 10,
        share: 5,
        data: videos.video1
    },
    {
        avatarUrl: 'https://www.millenniumpost.in/h-upload/2024/08/29/804354-dev-in-khadaan.webp',
        following: false,
        id: 2,
        title: 'Tín hiệu đi chụp áo dài 🧧 ',
        author: 'thanhngoc.tn76',
        postedDate: '6d ago',
        likes: 194,
        comments: 3,
        save: 2,
        share: 5,
        data: videos.video2
    },
    {
        avatarUrl: 'https://www.millenniumpost.in/h-upload/2024/08/29/804354-dev-in-khadaan.webp',
        following: false,
        id: 3,
        title: 'Ughhhh',
        author: 'behocbong',
        postedDate: '2024-12-14',
        likes: 7190,
        comments: 35,
        save: 231,
        share: 114,
        data: videos.video3
    },
    {
        avatarUrl: 'https://www.millenniumpost.in/h-upload/2024/08/29/804354-dev-in-khadaan.webp',
        following: false,
        id: 4,
        title: 'Ughhhh',
        author: '#CapCut   rau dắt răng không thể lấy ra',
        postedDate: '2024-12-13',
        likes: 125000,
        comments: 57,
        save: 622,
        share: 117,
        data: videos.video4
    }
];

function Home() {
    const [indexVideo, setIndexVideo] = useState(0);
    const videoContainerRef = useRef(null);
    const videoRefs = useRef([]);
    const isThrottled = useRef(false);

    const handleScroll = useCallback((e) => {
        if (isThrottled.current) return;

        const threshold = 50; // Ngưỡng cuộn tối thiểu
        if (Math.abs(e.deltaY) < threshold) return;

        isThrottled.current = true;

        setIndexVideo((prev) => {
            const newIndex = e.deltaY > 0
                ? Math.min(prev + 1, dataVideos.length - 1)
                : Math.max(prev - 1, 0);

            videoRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth" });
            return newIndex;
        });

        setTimeout(() => {
            isThrottled.current = false;
        }, 500); // Thời gian chặn cuộn: 500ms
    }, []);


    const handleChangePrevVideo = useCallback(() => {
        setIndexVideo((prev) => Math.max(prev - 1, 0));
        videoRefs.current[indexVideo - 1]?.scrollIntoView({ behavior: 'smooth' });
    }, [indexVideo]);

    const handleChangeNextVideo = useCallback(() => {
        setIndexVideo((prev) => Math.min(prev + 1, dataVideos.length - 1));
        videoRefs.current[indexVideo + 1]?.scrollIntoView({ behavior: 'smooth' });
    }, [indexVideo]);

    return (
        <div className={cx('wrapper')} ref={videoContainerRef} >
            <RecommendVideo videos={dataVideos} videoRefs={videoRefs} onWheel={handleScroll} />
            <NavigatorVideo
                index={indexVideo}
                handleClickPrevBtn={handleChangePrevVideo}
                handleClickNextBtn={handleChangeNextVideo}
            />
        </div>
    );
}

export default Home;
