export const paths = {
    login: () => `/login`,
    register: () => `/register`,
    home: () => `/`,
    notifications: () => `/notifications`,
    messages: () => `/messages`,
    profile: () => `/profile`,
    tweetDetails: (id: number) => `/tweet/${id}`
}