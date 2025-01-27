import config from '@/config';

//Pages
import HomePage from "@/pages/Home";
import FollowingPage from "@/pages/Following";
import ProfilePage from "@/pages/Profile";
import Upload from "@/pages/Upload";

//Layouts
import { UploadLayout } from "@/layouts";
import { FluidLayout } from '@/layouts/FluidLayout';
import { VideoPage } from '@/pages/VideoPage';

// guest routes
const publicRoutes = [
    { path: config.routes.home, component: HomePage },
    { path: config.routes.following, component: FollowingPage },
    { path: config.routes.profile, component: ProfilePage },
    { path: config.routes.upload, component: Upload, layout: UploadLayout },
    { path: config.routes.video, component: VideoPage, layout: FluidLayout},

];

// user routes
const privateRoutes = [
];

export { publicRoutes, privateRoutes };