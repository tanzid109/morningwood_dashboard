interface Video {
    id:number,
    title: string;
    userName:string,
    visibility: "Public" | "Private";
    streamedOn: string;
    views: string;
    likes: string;
}

export const videosData: Video[] = [
    {
        id: 1,
        title: "Morning Coffee Chat ☕ Real Talks & Laughs",
        userName:"@NovaXPlayz",
        visibility: "Public",
        streamedOn: "03 Aug 2025",
        views: "3.4M",
        likes: "34.5K"
    },
    {
        id: 2,
        title: "Storytime: My Funniest Streaming Moments😂",
        userName:"@NovaXPlayz",
        visibility: "Private",
        streamedOn: "13 Jul 2025",
        views: "1.7K",
        likes: "784"
    },
    {
        id: 3,
        title: "Toxic Chat Moments😂 - Unfiltered Stream Highlights",
        userName:"@NovaXPlayz",
        visibility: "Public",
        streamedOn: "06 Jul 2025",
        views: "399",
        likes: "121"
    },
    {
        id: 4,
        title: "Clutch or Crash! Valorant Ranked Night",
        userName:"@NovaXPlayz",
        visibility: "Public",
        streamedOn: "01 Jul 2025",
        views: "134",
        likes: "83"
    }
]