import  routerConfig from '@/Config/routes';

//Pages
import HomePage from "@/pages/Home";
import FollowingPage from "@/pages/Following";
import ProfilePage from "@/pages/Profile";
import Upload from "@/pages/Upload";

//Layouts
import { UploadLayout } from "@/Layout";

// guest routes
const publicRoutes = [
    { path: routerConfig.home, component: HomePage },
    { path: routerConfig.following, component: FollowingPage },
    { path: routerConfig.profile, component: ProfilePage },
    { path: routerConfig.upload, component: Upload, layout: UploadLayout },

];

// user routes
const privateRoutes = [
];

export { publicRoutes, privateRoutes };