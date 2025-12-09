
const testFilters = async () => {
    const baseUrl = 'http://localhost:3001/api/dashboard-data';

    // 1. Test Sort (Newest vs Oldest)
    console.log("--- Testing Sort ---");
    try {
        const resNew = await fetch(`${baseUrl}?sort=newest`);
        const dataNew = await resNew.json();
        const firstNew = dataNew.mentions[0];
        console.log(`Newest First Date: ${firstNew.date} ${firstNew.time}`);

        const resOld = await fetch(`${baseUrl}?sort=oldest`);
        const dataOld = await resOld.json();
        const firstOld = dataOld.mentions[0];
        console.log(`Oldest First Date: ${firstOld.date} ${firstOld.time}`);
    } catch (e) { console.error(e); }

    // 2. Test Sentiment Parameter
    console.log("\n--- Testing Sentiment=Negative ---");
    try {
        const resSent = await fetch(`${baseUrl}?sentiment=negative`);
        const dataSent = await resSent.json();
        const nonNegative = dataSent.mentions.filter(m => m.sentiment !== 'negative' && m.sentiment !== 'negativo');
        console.log(`Total mentions: ${dataSent.mentions.length}`);
        console.log(`Mentions NOT negative: ${nonNegative.length}`);
        if (nonNegative.length > 0) console.log("Example non-matching:", nonNegative[0]);
    } catch (e) { console.error(e); }

    // 3. Test EventName Parameter (Known broken)
    console.log("\n--- Testing EventName ---");
    try {
        const targetEvent = "Estreia no Paranaense";
        const resEvent = await fetch(`${baseUrl}?eventName=${encodeURIComponent(targetEvent)}`);
        const dataEvent = await resEvent.json();
        const matches = dataEvent.mentions.filter(m => m.eventName === targetEvent);
        console.log(`Requested Event: ${targetEvent}`);
        console.log(`Total Mentions Returned: ${dataEvent.mentions.length}`);
        console.log(`Matching Mentions: ${matches.length}`);
    } catch (e) { console.error(e); }
};

testFilters();
