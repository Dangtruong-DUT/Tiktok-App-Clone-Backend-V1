import HomePage from "@/pages/Home";
import FollowingPage from "@/pages/Following";
import ProfilePage from "@/pages/Profile";
import Upload from "@/pages/Upload";
import { UploadLayout } from "@/Layout";

const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/following', component: FollowingPage },
    { path: '/:username', component: ProfilePage },
    { path: '/upload', component: Upload, layout: UploadLayout },

];

const privateRoutes = [
];

export { publicRoutes, privateRoutes };