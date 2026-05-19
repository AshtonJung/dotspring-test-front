export default function() {
    const toKST = (date : Date) => {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const kstOffset = 9 * 60 * 60 * 1000;
        return new Date(utc + kstOffset);
    };

    const formatDate = (date : Date) => {
        const pad = (num : number) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const formatDateTime = (date : Date) => {
            const pad = (num : number) => (num < 10 ? '0' + num : num);
            return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const formatHour = (num : number) => {
        return num < 10 ? '0' + num : num.toString();
    };

    const today = computed(() => formatDate(toKST(new Date())));
    const yesterday = computed(() => {
        const date = toKST(new Date());
        date.setDate(date.getDate() - 1);
        return formatDate(date);
    });
    const firstDayOfMonth = computed(() => {
        const date = toKST(new Date());
        date.setDate(1);
        return formatDate(date);
    });
    const lastDayOfMonth = computed(() => {
        const date = toKST(new Date());
        date.setMonth(date.getMonth() + 1, 0);      // 현재 날짜의 다음 달 0번째 날짜
        return formatDate(date);
    });
    const oneWeekAgo = computed(() => {
        const date = toKST(new Date());
        date.setDate(date.getDate() - 7);
        return formatDate(date);
    });

    const getCurrentDateTime = () => formatDateTime(toKST(new Date()));
    const getCurrentHour = () => formatHour(toKST(new Date()).getHours());
    const getOneHourAgo = () => {
        const date = toKST(new Date());
        date.setHours(date.getHours() - 1);
        return formatHour(date.getHours());
    };

    return {
        today,
        yesterday,
        firstDayOfMonth,
        lastDayOfMonth,
        oneWeekAgo,
        getCurrentDateTime,
        getCurrentHour,
        getOneHourAgo
    };
}