export const paths = {
    login: () => `/login`,
    register: () => `/register`,
    home: () => `/`,
    notifications: () => `/notifications`,
    messages: () => `/messages`,
    profile: () => `/profile`,
    userProfile: (name?: string) => `/profile/${name}`,
    tweetDetails: (id: number) => `/tweet/${id}`
}