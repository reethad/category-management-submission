const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const app = require("../server")
const Bundle = require("../models/Bundle")
const User = require("../models/User")

describe("Bundle API", () => {
  let token
  let bundleId

  before(async () => {
    // Create a test seller
    const seller = new User({
      name: "Test Seller",
      email: "test.seller@example.com",
      password: "password123",
      role: "seller",
    })

    await seller.save()

    // Login and get token
    const res = await request(app).post("/api/auth/login").send({
      email: "test.seller@example.com",
      password: "password123",
    })

    token = res.body.token
  })

  after(async () => {
    // Clean up test data
    await Bundle.deleteMany({})
    await User.deleteMany({ email: "test.seller@example.com" })
  })

  describe("POST /api/bundles", () => {
    it("should create a new bundle when valid data is provided", async () => {
      const bundleData = {
        name: "Test Bundle",
        description: "Test Description",
        products: [
          { id: "p1", name: "Product 1", price: 10 },
          { id: "p2", name: "Product 2", price: 20 },
        ],
        status: "draft",
      }

      const res = await request(app).post("/api/bundles").set("Authorization", `Bearer ${token}`).send(bundleData)

      expect(res.status).to.equal(201)
      expect(res.body).to.have.property("_id")
      expect(res.body.name).to.equal(bundleData.name)
      expect(res.body.originalPrice).to.equal(30)
      expect(res.body.discountedPrice).to.equal(27)

      bundleId = res.body._id // Save for later tests
    })

    it("should return 400 when bundle has less than 2 products", async () => {
      const bundleData = {
        name: "Invalid Bundle",
        description: "Not enough products",
        products: [{ id: "p1", name: "Product 1", price: 10 }],
        status: "draft",
      }

      const res = await request(app).post("/api/bundles").set("Authorization", `Bearer ${token}`).send(bundleData)

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property("error")
    })
  })

  describe("GET /api/bundles", () => {
    it("should return all bundles with pagination", async () => {
      const res = await request(app).get("/api/bundles")

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("bundles")
      expect(res.body).to.have.property("pagination")
      expect(res.body.pagination).to.have.property("total")
      expect(res.body.pagination).to.have.property("page")
      expect(res.body.pagination).to.have.property("limit")
    })

    it("should filter bundles by status", async () => {
      const res = await request(app).get("/api/bundles?status=draft")

      expect(res.status).to.equal(200)
      expect(res.body.bundles).to.be.an("array")

      // All returned bundles should have draft status
      res.body.bundles.forEach((bundle) => {
        expect(bundle.status).to.equal("draft")
      })
    })
  })

  describe("GET /api/bundles/:id", () => {
    it("should return a specific bundle", async () => {
      const res = await request(app).get(`/api/bundles/${bundleId}`)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("_id")
      expect(res.body._id).to.equal(bundleId)
    })

    it("should return 404 for non-existent bundle", async () => {
      const res = await request(app).get("/api/bundles/60f1a5c5f5e8a82d9c9c9c9c")

      expect(res.status).to.equal(404)
      expect(res.body).to.have.property("error")
    })
  })

  describe("PATCH /api/bundles/:id", () => {
    it("should update a bundle", async () => {
      const updateData = {
        name: "Updated Bundle Name",
        status: "active",
      }

      const res = await request(app)
        .patch(`/api/bundles/${bundleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)

      expect(res.status).to.equal(200)
      expect(res.body.name).to.equal(updateData.name)
      expect(res.body.status).to.equal(updateData.status)
    })
  })

  describe("GET /api/bundles/:id/checkDiscount", () => {
    it("should return discount information", async () => {
      const res = await request(app).get(`/api/bundles/${bundleId}/checkDiscount`)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("bundleId")
      expect(res.body).to.have.property("originalPrice")
      expect(res.body).to.have.property("discountedPrice")
      expect(res.body).to.have.property("savings")
      expect(res.body).to.have.property("discountPercentage")
      expect(res.body.discountPercentage).to.equal(10)
    })
  })

  describe("DELETE /api/bundles/:id", () => {
    it("should delete a bundle", async () => {
      const res = await request(app).delete(`/api/bundles/${bundleId}`).set("Authorization", `Bearer ${token}`)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success")
      expect(res.body.success).to.be.true

      // Verify bundle is deleted
      const checkRes = await request(app).get(`/api/bundles/${bundleId}`)
      expect(checkRes.status).to.equal(404)
    })
  })
})
