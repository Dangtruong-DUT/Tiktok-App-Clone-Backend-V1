import { upload } from "@testing-library/user-event/dist/upload";

const routes = {
    home: '/',
    following: '/following',
    profile: '/:username',
    upload: '/upload',
    search: '/search'
}

export default routes;