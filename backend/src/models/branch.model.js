const mongoose = require("mongoose");
const { BRANCH_STATUS } = require("./enums");
const { slugify, randomSuffix } = require("../utils/slug");

const branchSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    // Used in the per-branch survey link: <base>/<shortCode>/<slug>. Generated automatically.
    slug: { type: String, lowercase: true, trim: true, maxlength: 150 },
    country: { type: String, trim: true, maxlength: 100 },
    city: { type: String, trim: true, maxlength: 100 },
    address: { type: String, trim: true, maxlength: 255 }, // street address
    status: { type: String, enum: BRANCH_STATUS, required: true, default: "active" },
    archivedAt: { type: Date }, // set when status becomes "archived"
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

branchSchema.index({ businessId: 1, name: 1 }, { unique: true });
// Partial, so branches created before slugs existed (no slug yet) don't collide with each other.
branchSchema.index(
  { businessId: 1, slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $type: "string" } } }
);

// Unique slug inside one business: "cairo", or "cairo-a1b2c3" on collision.
// Arabic-only names slugify to "", so fall back to "branch".
branchSchema.statics.generateUniqueSlug = async function (businessId, name) {
  const base = slugify(name) || "branch";
  if (!(await this.exists({ businessId, slug: base }))) return base;

  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${randomSuffix()}`;
    if (!(await this.exists({ businessId, slug: candidate }))) return candidate;
  }

  throw new Error("Could not generate a unique branch slug");
};

// Existing code (onboarding) creates branches with Branch.create(...): the slug is filled in here.
branchSchema.pre("validate", async function () {
  if (!this.slug && this.name) {
    this.slug = await this.constructor.generateUniqueSlug(this.businessId, this.name);
  }
});

module.exports = mongoose.model("Branch", branchSchema);
