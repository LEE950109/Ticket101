export const recommendedPerformances = [
    { id: "r1", title: "뮤지컬 라이온킹", image: "https://picsum.photos/200/280?random=1" },
    { id: "r2", title: "뮤지컬 위키드", image: "https://picsum.photos/200/280?random=2" },
    { id: "r3", title: "뮤지컬 오페라의 유령", image: "https://picsum.photos/200/280?random=3" },
    { id: "r4", title: "뮤지컬 맘마미아", image: "https://picsum.photos/200/280?random=4" },
    { id: "r5", title: "뮤지컬 레미제라블", image: "https://picsum.photos/200/280?random=5" },
    { id: "r6", title: "뮤지컬 캣츠", image: "https://picsum.photos/200/280?random=6" },
    { id: "r7", title: "뮤지컬 아이다", image: "https://picsum.photos/200/280?random=7" },
    { id: "r8", title: "뮤지컬 지킬앤하이드", image: "https://picsum.photos/200/280?random=8" },
    { id: "r9", title: "뮤지컬 데스노트", image: "https://picsum.photos/200/280?random=9" },
    { id: "r10", title: "뮤지컬 엘리자벳", image: "https://picsum.photos/200/280?random=10" }
];

export const ticketSites = [
    {
        name: "인터파크",
        id: "interpark",
        shows: Array.from({ length: 10 }, (_, i) => ({
            id: `i${i + 1}`,
            title: `인터파크 공연${i + 1}`,
            image: `https://picsum.photos/200/280?random=${11 + i}`
        }))
    },
    {
        name: "YES24",
        id: "yes24",
        shows: Array.from({ length: 10 }, (_, i) => ({
            id: `y${i + 1}`,
            title: `YES24 공연${i + 1}`,
            image: `https://picsum.photos/200/280?random=${21 + i}`
        }))
    },
    {
        name: "멜론티켓",
        id: "melon",
        shows: Array.from({ length: 10 }, (_, i) => ({
            id: `m${i + 1}`,
            title: `멜론 공연${i + 1}`,
            image: `https://picsum.photos/200/280?random=${31 + i}`
        }))
    },
    {
        name: "티켓링크",
        id: "ticketlink",
        shows: Array.from({ length: 10 }, (_, i) => ({
            id: `t${i + 1}`,
            title: `티켓링크 공연${i + 1}`,
            image: `https://picsum.photos/200/280?random=${41 + i}`
        }))
    }
];
