import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: 'https://close-bream-142276.upstash.io',
    token: 'gQAAAAAAAivEAAIgcDEzOTlkNTdhYjViMDk0MTNiYjM0YzIwNGEwODcwNjViOA',
})

async function run() {
    console.log("Setting key 'foo' to 'bar'...");
    await redis.set("foo", "bar");

    console.log("Retrieving key 'foo'...");
    const value = await redis.get("foo");

    console.log(`\n🎉 Success! Retrieved value: ${value}`);
}

run();
