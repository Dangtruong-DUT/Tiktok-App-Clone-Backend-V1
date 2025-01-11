import config from '@/config';

//Pages
import HomePage from "@/pages/Home";
import FollowingPage from "@/pages/Following";
import ProfilePage from "@/pages/Profile";
import Upload from "@/pages/Upload";

//Layouts
import { UploadLayout } from "@/layouts";

// guest routes
const publicRoutes = [
    { path: config.routes.home, component: HomePage },
    { path: config.routes.following, component: FollowingPage },
    { path: config.routes.profile, component: ProfilePage },
    { path: config.routes.upload, component: Upload, layout: UploadLayout },

];

// user routes
const privateRoutes = [
];

export { publicRoutes, privateRoutes };