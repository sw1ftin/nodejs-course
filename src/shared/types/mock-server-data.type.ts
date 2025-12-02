export type MockServerData = {
    titles: string[];
    descriptions: string[];
    images: string[];
    users: string[];
    emails: string[];
    avatars: string[];
    passwords: string[];
    previewImages?: string[];
};

export type MockServerResponse = {
    api: MockServerData;
};
