const getTimestamps = (startDate, endDate) => {

    const formatToISO = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    const startISO = formatToISO(startDate);
    const endISO = formatToISO(endDate);

    const startTimestamp = new Date(`${startISO}T00:00:00Z`).getTime() / 1000;
    const endTimestamp = new Date(`${endISO}T23:59:59Z`).getTime() / 1000;

    // console.log(startTimestamp, endTimestamp);

    return {
        startTimestamp,
        endTimestamp
    };
};

module.exports = getTimestamps;