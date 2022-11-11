const app = require("../server.js");
const seed = require("../seed.js");
const request = require("supertest");
const {db} = require('../db')

beforeAll(async () => {
    await seed();
})

describe("Testing User routes", () => {

    describe("Get all users", () => {
        it("Returns 200 status", async () => {
            const { statusCode } = await request(app).get("/users");
            expect(statusCode).toBe(200);
        })
        it("Returns JSON data", async () => {
            const { headers } = await request(app).get("/users");
            expect(headers["content-type"]).toMatch("application/json");
        })
        it("Returns array of Users", async () => {
            const { body } = await request(app).get("/users");
            
            expect(Array.isArray(body)).toBe(true);
            expect(
              body.every(({ username, password }) => username && password)
            );
        })
    })

    describe("Get one user", () => {
        describe("Given ID of a valid user", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).get("/users/1");
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).get("/users/1");
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns correct User", async () => {
                const { body } = await request(app).get("/users/1");
                expect(body.id).toBe(1);
                expect(body.username).toBe('testUser@gmail.com');
                expect(body.password).toBe('ThisIsA');
            })
        })

        describe("Given invalid ID", () => {
            it("Returns 400 status when given non numeric ID", async () => {
                const { statusCode } = await request(app).get("/users/thisisnotanumber");
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no User has that ID", async () => {
                const { statusCode } = await request(app).get("/users/5");
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Add shows to user", () => {
        describe("Given ID of a valid user and valid ID of show", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).put("/users/1/shows/1");
                expect(statusCode).toBe(200);
            })
            it("Add another show (many to many) Returns 200 status", async () => {
                const { statusCode } = await request(app).put("/users/1/shows/2");
                expect(statusCode).toBe(200);
            })
            it("Add same show to different user (many to many) Returns 200 status", async () => {
                const { statusCode } = await request(app).put("/users/2/shows/2");
                expect(statusCode).toBe(200);
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when given non numeric user ID", async () => {
                const { statusCode } = await request(app).put("/users/thisisnotanumber/shows/3");
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when given non numeric show ID", async () => {
                const { statusCode } = await request(app).put("/users/1/shows/thisisnotanumber");
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no User has that ID", async () => {
                const { statusCode } = await request(app).put("/users/5/shows/4");
                expect(statusCode).toBe(404);
            })
            it("Returns 404 status when no show has that ID", async () => {
                const { statusCode } = await request(app).put("/users/1/shows/100");
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Create a user", () => {
        describe("Given valid data", () => {
            it("Returns 200 status", async () => {
                const { statusCode, headers } = await request(app).post("/users/").send({ username: "teddyputus1@gmail.com", password: "thisisaterriblepassword" });
                expect(statusCode).toBe(200);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Created User is now in database", async () => {
                const { body } = await request(app).get("/users/3");
                expect(body.id).toBe(3);
                expect(body.username).toBe("teddyputus1@gmail.com");
                expect(body.password).toBe("thisisaterriblepassword");
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when no username given", async () => {
                const { statusCode } = await request(app).post("/users/").send({ password: "thisisaterriblepassword" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when no password given", async () => {
                const { statusCode } = await request(app).post("/users/").send({  username: "teddyputus2@gmail.com" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when username is not an email", async () => {
                const { statusCode } = await request(app).post("/users/").send({  username: "teddyputus1.com" , password: "thisisaterriblepassword" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when password less than 6 characters", async () => {
                const { statusCode } = await request(app).post("/users/").send({  username: "teddyputus3@gmail.com" , password: "this" });
                expect(statusCode).toBe(400);
            })
        })
    })



    describe("Retrieve shows belonging to the user", () => {
        describe("Given ID of a valid user", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).get("/users/1/shows");
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).get("/users/1/shows");
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns array of show data", async () => {
                const { body } = await request(app).get("/users/1/shows");
                expect(Array.isArray(body)).toBe(true);
                expect(
                  body.every(({ title, genre, rating}) => title && genre && rating)
                );
            })
            it("Returns correct show data", async () => {
                const { body } = await request(app).get("/users/1/shows");
                expect(body.length).toBe(2);
                expect(body[0].title).toBe("King of Queens");
                expect(body[1].title).toBe("X-Files");
            })
            it("Returns empty array if user has no shows", async () => {
                const { body } = await request(app).get("/users/3/shows");
                expect(body.length).toBe(0);
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when given non numeric user ID", async () => {
                const { statusCode } = await request(app).get("/users/thisisnotanumber/shows");
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no User has that ID", async () => {
                const { statusCode } = await request(app).get("/users/100/shows");
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Remove show from a user", () => {
        describe("Given ID of a valid user and valid ID of show", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).patch("/users/1/shows/1");
                expect(statusCode).toBe(200);
            })
            it("Show has actually been removed from user", async () => {
                const { body } = await request(app).get("/users/1/shows");
                expect(body.length).toBe(1);
                expect(body[0].title).toBe("X-Files");
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when given non numeric user ID", async () => {
                const { statusCode } = await request(app).patch("/users/thisisnotanumber/shows/2");
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when given non numeric show ID", async () => {
                const { statusCode } = await request(app).patch("/users/1/shows/thisisnotanumber");
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no User has that ID", async () => {
                const { statusCode } = await request(app).patch("/users/500/shows/2");
                expect(statusCode).toBe(404);
            })
            it("Returns 404 status when no show has that ID", async () => {
                const { statusCode } = await request(app).patch("/users/1/shows/100");
                expect(statusCode).toBe(404);
            })
        })
    })
});

describe("Testing Show routes", () => {
    describe("Get all shows", () => {
        it("Returns 200 status", async () => {
            const { statusCode } = await request(app).get("/shows");
            expect(statusCode).toBe(200);
        })
        it("Returns JSON data", async () => {
            const { headers } = await request(app).get("/shows");
            expect(headers["content-type"]).toMatch("application/json");
        })
        it("Returns array of Shows", async () => {
            const { body } = await request(app).get("/shows");
            
            expect(Array.isArray(body)).toBe(true);
            expect(
              body.every(({ title, genre, rating, status }) => title && genre && rating && status)
            );
        })
    })

    describe("Get one show", () => {
        describe("Given ID of a valid show", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).get("/shows/1");
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).get("/shows/1");
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns correct User", async () => {
                const { body } = await request(app).get("/shows/1");
                expect(body.id).toBe(1);
                expect(body.title).toBe('King of Queens');
            })
        })

        describe("Given invalid ID", () => {
            it("Returns 400 status when given non numeric ID", async () => {
                const { statusCode } = await request(app).get("/shows/thisisnotanumber");
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no show has that ID", async () => {
                const { statusCode } = await request(app).get("/shows/500");
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Get all shows of a given genre", () => {
        describe("Given valid genre", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).get("/shows/genre/Comedy");
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).get("/shows/genre/Comedy");
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns array of Shows", async () => {
                const { body } = await request(app).get("/shows/genre/Comedy");
                
                expect(Array.isArray(body)).toBe(true);
                expect(
                  body.every(({ title, genre, rating, status }) => title && genre && rating && status)
                );
            })
        })

        describe("Given invalid genre", () => {
            it("Returns 400 status when genre is over 25 characters", async () => {
                const { statusCode } = await request(app).get("/shows/genre/someRandomGenreThatHasAStupidlyLongNameForSomeReason");
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when genre is under 3 characters", async () => {
                const { statusCode } = await request(app).get("/shows/genre/tv");
                expect(statusCode).toBe(400);
            })
        })
    })

    describe("Update the rating of a show", () => {
        describe("Given valid show and rating", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).put("/shows/2/rating").send({  rating: 10 });
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).put("/shows/2/rating").send({  rating: 10 });
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Show has been updated", async () => {
                const { body } = await request(app).get("/shows/2");
                expect(body.rating).toBe(10)
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when no rating given", async () => {
                const { statusCode } = await request(app).put("/shows/2/rating")
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when rating not numeric", async () => {
                const { statusCode } = await request(app).put("/shows/2/rating").send({  rating: "It was very good" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when show ID not numeric", async () => {
                const { statusCode } = await request(app).put("/shows/two/rating").send({  rating: 10 });
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no show has given ID", async () => {
                const { statusCode } = await request(app).put("/shows/2000/rating").send({  rating: 10 });
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Update the status of a show", () => {
        describe("Given valid show and rating", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).put("/shows/2/update").send({  status: "cancelled" });
                expect(statusCode).toBe(200);
            })
            it("Returns JSON data", async () => {
                const { headers } = await request(app).put("/shows/2/update").send({  rating: "cancelled" });
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Show has been updated", async () => {
                const { body } = await request(app).get("/shows/2");
                expect(body.status).toBe("cancelled")
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when no status given", async () => {
                const { statusCode } = await request(app).put("/shows/2/update")
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when status longer than 25 characters", async () => {
                const { statusCode } = await request(app).put("/shows/2/update").send({  status: "It has been cancelled because it isn't very good" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when status less than 5 characters", async () => {
                const { statusCode } = await request(app).put("/shows/2/update").send({  status: "dead" });
                expect(statusCode).toBe(400);
            })
            it("Returns 400 status when show ID not numeric", async () => {
                const { statusCode } = await request(app).put("/shows/two/update").send({  status: "cancelled" });
                expect(statusCode).toBe(400);
            })
            it("Returns 404 status when no show has given ID", async () => {
                const { statusCode } = await request(app).put("/shows/2000/update").send({  status: "cancelled" });
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Delete a show", () => {
        describe("Given valid show ID", () => {
            it("Returns 200 status", async () => {
                const { statusCode } = await request(app).delete("/shows/11");
                expect(statusCode).toBe(200);
            })
            it("Returns number of shows deleted (1)", async () => {
                const { headers, body } = await request(app).delete("/shows/10");
                expect(body).toBe(1);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 404 status when trying to retrieve deleted show", async () => {
                const { statusCode } = await request(app).get("/shows/10");
                expect(statusCode).toBe(404);
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when show ID not numeric", async () => {
                const { statusCode } = await request(app).delete("/shows/five");
                expect(statusCode).toBe(400);
            })
            it("Returns number of shows deleted (0) when the show didn't exist", async () => {
                const { headers, body } = await request(app).delete("/shows/10");
                expect(body).toBe(0);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 404 status when show didn't exist", async () => {
                const { statusCode } = await request(app).delete("/shows/10");
                expect(statusCode).toBe(404);
            })
        })
    })

    describe("Create a show", () => {
        describe("Given valid data", () => {
            it("Returns 200 status", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power", status:"on-going", genre:"Drama", rating:1 });
                expect(statusCode).toBe(200);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Created Show is now in database", async () => {
                const { body } = await request(app).get("/shows/12");
                expect(body.id).toBe(12);
                expect(body.title).toBe("Rings of Power");
                expect(body.genre).toBe("Drama");
            })
        })

        describe("Given invalid data", () => {
            it("Returns 400 status when no title given", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ status:"on-going", genre:"Drama", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when title longer than 25 characters", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Powerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", status:"on-going", genre:"Drama", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when no status given", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power", genre:"Drama", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when status more than 25 characters", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power",  status:"on-going for some unknown reason", genre:"Drama", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when status less than 5 characters", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power",  status:"on-going for some unknown reason", genre:"Drama", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when genre is missing", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power", status:"on-going", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when genre is less than 3 characters", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power", status:"on-going", genre:"Dr", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when genre is more than 25 characters", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ title: "Rings of Power", status:"on-going", genre:"Dramaramramramramramramramramramramramramramramramram", rating:1 });
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when no rating given", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ status:"on-going", genre:"Drama"});
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })
            it("Returns 400 status when rating is non numeric", async () => {
                const { statusCode, headers } = await request(app).post("/shows").send({ status:"on-going", genre:"Drama", rating:"two"});
                expect(statusCode).toBe(400);
                expect(headers["content-type"]).toMatch("application/json");
            })

        })
    })
    describe("Get 500 errors, when server is closed", () => {
        beforeAll(async () => {
            await db.close();
        })
        it("Get users", async () => {
            const { statusCode } = await request(app).get("/users");
            expect(statusCode).toBe(500);
        })
        it("Get one user", async () => {
            const { statusCode } = await request(app).get("/users/1");
            expect(statusCode).toBe(500);
        })
        it("Add show to user", async () => {
            const { statusCode } = await request(app).put("/users/1/shows/1");
            expect(statusCode).toBe(500);
        })
        it("Get user shows", async () => {
            const { statusCode } = await request(app).get("/users/1/shows");
            expect(statusCode).toBe(500);
          })
          it("add show to user", async () => {
            const { statusCode } = await request(app).patch("/users/1/shows/1");
            expect(statusCode).toBe(500);
          })
          it("Get all shows", async () => {
            const { statusCode } = await request(app).get("/shows");
            expect(statusCode).toBe(500);
          })
          it("get one show", async () => {
            const { statusCode } = await request(app).get("/shows/1");
            expect(statusCode).toBe(500);
          })
          it("Get all shows of one genre", async () => {
            const { statusCode } = await request(app).get("/shows/genre/Comedy");
            expect(statusCode).toBe(500);
          })
          it("Update rating", async () => {
            const { statusCode } = await request(app).put("/shows/2/rating").send({  rating: 10 });
            expect(statusCode).toBe(500);
          })
          it("Update status", async () => {
            const { statusCode } = await request(app).put("/shows/2/update").send({  status: "cancelled" });
            expect(statusCode).toBe(500);
          })
          it("delete a show", async () => {
            const { statusCode } = await request(app).delete("/shows/11");
            expect(statusCode).toBe(500);
          })
    })
})
