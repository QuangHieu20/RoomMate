import {getLocalStorage} from "~/ultils/localStorage";

export default defineNuxtRouteMiddleware(async (to) => {
    if (process.client) {
        const user = await getLocalStorage("userInfo")

        // Nếu đã login rồi mà vẫn mò vào /login hoặc /register thì redirect ra /
        if (user?.id) {
            return navigateTo('/')
        }
    }
})
