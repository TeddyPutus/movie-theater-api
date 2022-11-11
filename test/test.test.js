const app = require("../server.js");
const seed = require("../seed.js");
const request = require("supertest");

beforeAll(async () => {
    await seed();
})

describe("Testing the user routes", () => {
    

    describe("Get all users", () => {
        it("Returns 200 status", async () => {
            const { statusCode } = await request(app).get("/users");
            expect(statusCode).toBe(200);
        })
    })

});