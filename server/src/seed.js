/**
 * BlogSphere — Demo Data Seed Script
 * -----------------------------------
 * Clears all collections and inserts rich demo data.
 *
 * Usage:
 *   npm run seed
 *
 * Requires a valid MONGODB_URL in the server's .env file.
 *
 * Demo password for every seeded account: Password@123
 */

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DB_NAME } from "./constants.js";

// ── Models ───────────────────────────────────────────────────────────────────
import User from "./models/user.model.js";
import Category from "./models/category.model.js";
import Tag from "./models/tag.model.js";
import Blog from "./models/blog.model.js";
import Comment from "./models/comment.model.js";
import Like from "./models/like.model.js";
import Bookmark from "./models/bookmark.model.js";
import Follow from "./models/follow.model.js";
import Report from "./models/report.model.js";

// ── DB Connection ─────────────────────────────────────────────────────────────
const connectDB = async () => {
  const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
  console.log(`\n🤝 MongoDB connected: ${conn.connection.host}\n`);
};

// ── Seed ──────────────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  // ── 1. Clear existing data ─────────────────────────────────────────────────
  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Tag.deleteMany({}),
    Blog.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
    Bookmark.deleteMany({}),
    Follow.deleteMany({}),
    Report.deleteMany({}),
  ]);

  // ── 2. Users ───────────────────────────────────────────────────────────────
  console.log("👤 Creating users...");
  // Pre-hash once — all demo accounts share the same password
  const hashedPassword = await bcrypt.hash("Password@123", 8);

  const users = await User.insertMany([
    {
      name: "Admin User",
      username: "admin",
      email: "admin@blogsphere.com",
      password: hashedPassword,
      role: "ADMIN",
      gender: "MALE",
      bio: "Platform administrator for BlogSphere.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4",
    },
    {
      name: "Alice Johnson",
      username: "alicejohnson",
      email: "alice@blogsphere.com",
      password: hashedPassword,
      role: "USER",
      gender: "FEMALE",
      bio: "Tech enthusiast and frontend developer. I love sharing what I learn about JavaScript and modern frameworks.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=alicejohnson&backgroundColor=ffd5dc",
    },
    {
      name: "Bob Williams",
      username: "bobwilliams",
      email: "bob@blogsphere.com",
      password: hashedPassword,
      role: "USER",
      gender: "MALE",
      bio: "Full-stack developer with a passion for Node.js and open source. Building cool stuff one commit at a time.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=bobwilliams&backgroundColor=c0aede",
    },
    {
      name: "Carol Smith",
      username: "carolsmith",
      email: "carol@blogsphere.com",
      password: hashedPassword,
      role: "USER",
      gender: "FEMALE",
      bio: "UI/UX designer and creative writer. Coffee addict. Firm believer that beautiful design and great code go hand in hand.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=carolsmith&backgroundColor=ffdfbf",
    },
    {
      name: "David Lee",
      username: "davidlee",
      email: "david@blogsphere.com",
      password: hashedPassword,
      role: "USER",
      gender: "MALE",
      bio: "DevOps engineer specialising in Kubernetes and cloud-native infrastructure. K8s or bust.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=davidlee&backgroundColor=d1f0b1",
    },
    {
      name: "Emma Brown",
      username: "emmabrown",
      email: "emma@blogsphere.com",
      password: hashedPassword,
      role: "USER",
      gender: "FEMALE",
      bio: "Data scientist and machine learning enthusiast. Python, pandas and a good dataset are all I need.",
      avatar:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=emmabrown&backgroundColor=b6e3f4",
    },
  ]);

  const [admin, alice, bob, carol, david, emma] = users;

  // ── 3. Categories ──────────────────────────────────────────────────────────
  console.log("📂 Creating categories...");
  const categories = await Category.insertMany([
    {
      name: "Technology",
      slug: "technology",
      description: "Articles about the latest in tech, software and hardware.",
      featureImage: "https://picsum.photos/seed/technology/800/450",
      createdBy: admin._id,
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Tutorials and articles on building for the web.",
      featureImage: "https://picsum.photos/seed/webdev/800/450",
      createdBy: admin._id,
    },
    {
      name: "Design",
      slug: "design",
      description: "UI/UX, graphic design and creative content.",
      featureImage: "https://picsum.photos/seed/design/800/450",
      createdBy: admin._id,
    },
    {
      name: "Data Science",
      slug: "data-science",
      description: "Machine learning, AI, and data analytics.",
      featureImage: "https://picsum.photos/seed/datascience/800/450",
      createdBy: admin._id,
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "CI/CD, cloud infrastructure and containerisation.",
      featureImage: "https://picsum.photos/seed/devops/800/450",
      createdBy: admin._id,
    },
    {
      name: "Career",
      slug: "career",
      description: "Tips and advice for developers and tech professionals.",
      featureImage: "https://picsum.photos/seed/career/800/450",
      createdBy: admin._id,
    },
  ]);

  const [techCat, webdevCat, designCat, dsCat, devopsCat, careerCat] =
    categories;

  // ── 4. Tags ────────────────────────────────────────────────────────────────
  console.log("🏷️  Creating tags...");
  const tags = await Tag.insertMany([
    { name: "javascript", slug: "javascript" },
    { name: "typescript", slug: "typescript" },
    { name: "react", slug: "react" },
    { name: "angular", slug: "angular" },
    { name: "nodejs", slug: "nodejs" },
    { name: "python", slug: "python" },
    { name: "css", slug: "css" },
    { name: "docker", slug: "docker" },
    { name: "kubernetes", slug: "kubernetes" },
    { name: "machine-learning", slug: "machine-learning" },
    { name: "open-source", slug: "open-source" },
    { name: "career-tips", slug: "career-tips" },
  ]);

  const [
    jsTag,
    tsTag,
    reactTag,
    angularTag,
    nodeTag,
    pythonTag,
    cssTag,
    dockerTag,
    k8sTag,
    mlTag,
    osTag,
    careerTag,
  ] = tags;

  // ── 5. Blogs ───────────────────────────────────────────────────────────────
  console.log("📝 Fetching and creating blogs...");

  // Fetch fake data from online API
  const postsResponse = await fetch("https://dummyjson.com/posts?limit=11");
  const postsData = await postsResponse.json();
  const apiPosts = postsData.posts;

  const categoryList = [
    techCat,
    webdevCat,
    designCat,
    dsCat,
    devopsCat,
    careerCat,
  ];
  const tagList = [
    jsTag,
    tsTag,
    reactTag,
    angularTag,
    nodeTag,
    pythonTag,
    cssTag,
    dockerTag,
    k8sTag,
    mlTag,
    osTag,
    careerTag,
  ];
  const authors = [alice, bob, carol, emma, david];

  const blogPayloads = apiPosts.map((post, index) => {
    // Keep the 11th article as a draft to match the original setup
    const isDraft = index === 10;

    // Generate a slug from the title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return {
      userId: authors[index % authors.length]._id,
      title: post.title,
      slug: slug,
      featureImage: `https://picsum.photos/seed/${slug}/1200/630`,
      // Format the fetched plain text into HTML
      content: `<h2>${post.title}</h2>
<p>${post.body}</p>
<h3>Summary</h3>
<p>This is dynamic content fetched from DummyJSON. <strong>Tags:</strong> ${post.tags.join(", ")}</p>`,
      category: categoryList[index % categoryList.length]._id,
      tags: [
        tagList[index % tagList.length]._id,
        tagList[(index + 1) % tagList.length]._id,
      ],
      isPublic: !isDraft,
      isDraft: isDraft,
      visits: post.views || Math.floor(Math.random() * 1000),
    };
  });

  const blogs = await Blog.insertMany(blogPayloads);

  // ── 6. Comments ────────────────────────────────────────────────────────────
  console.log("💬 Creating comments...");
  const topLevelComments = await Comment.insertMany([
    // Blog 0 – TypeScript
    {
      userId: bob._id,
      blogId: blogs[0]._id,
      content: "Great intro to TypeScript! The setup section is really clear.",
    },
    {
      userId: carol._id,
      blogId: blogs[0]._id,
      content:
        "I was hesitant to switch from plain JS but this convinced me. Thanks Alice!",
    },
    {
      userId: david._id,
      blogId: blogs[0]._id,
      content:
        "TypeScript enums are a game-changer for large codebases — underrated feature.",
    },
    // Blog 1 – Node REST API
    {
      userId: alice._id,
      blogId: blogs[1]._id,
      content: "Loved the section on middleware. Very clear explanation.",
    },
    {
      userId: emma._id,
      blogId: blogs[1]._id,
      content: "Could you add a follow-up article on authentication with JWTs?",
    },
    // Blog 2 – UI Design
    {
      userId: alice._id,
      blogId: blogs[2]._id,
      content:
        "The accessibility section is so important — more people need to read this.",
    },
    {
      userId: bob._id,
      blogId: blogs[2]._id,
      content:
        "These principles apply across all platforms. Well written, Carol!",
    },
    // Blog 3 – ML with Python
    {
      userId: carol._id,
      blogId: blogs[3]._id,
      content: "Perfect starting point for ML beginners. Bookmarked!",
    },
    {
      userId: david._id,
      blogId: blogs[3]._id,
      content:
        "scikit-learn is so approachable thanks to guides like yours, Emma.",
    },
    // Blog 4 – Docker
    {
      userId: alice._id,
      blogId: blogs[4]._id,
      content:
        "The Docker Compose section saved me hours of debugging. Thank you!",
    },
    {
      userId: emma._id,
      blogId: blogs[4]._id,
      content: "Multi-stage builds are underrated. Glad you mentioned them.",
    },
    // Blog 5 – Angular vs React
    {
      userId: bob._id,
      blogId: blogs[5]._id,
      content:
        "I would add that Angular's dependency injection is one of its biggest strengths.",
    },
    {
      userId: carol._id,
      blogId: blogs[5]._id,
      content:
        "Finally a balanced comparison. Most articles are too biased one way.",
    },
    // Blog 7 – CSS Tricks
    {
      userId: alice._id,
      blogId: blogs[7]._id,
      content: "CSS Grid changed my life. Great list, Carol!",
    },
    {
      userId: emma._id,
      blogId: blogs[7]._id,
      content:
        "The clamp() tip is so useful. Never going back to media queries for font sizes.",
    },
    // Blog 8 – Dev Job
    {
      userId: alice._id,
      blogId: blogs[8]._id,
      content:
        "The open source section resonated with me — that is how I landed my first role.",
    },
    {
      userId: bob._id,
      blogId: blogs[8]._id,
      content: "Networking is massively underestimated by so many devs.",
    },
    {
      userId: carol._id,
      blogId: blogs[8]._id,
      content: "This would have been so helpful when I was starting out!",
    },
    // Blog 9 – CI/CD
    {
      userId: alice._id,
      blogId: blogs[9]._id,
      content:
        "Shifting security left is the most important point here. Agreed 100%.",
    },
    {
      userId: emma._id,
      blogId: blogs[9]._id,
      content: "GitHub Actions has been a game-changer for my team's workflow.",
    },
  ]);

  // Replies (parentComment set)
  await Comment.insertMany([
    {
      userId: alice._id,
      blogId: blogs[0]._id,
      content: "Thanks Bob! Really glad it helped.",
      parentComment: topLevelComments[0]._id,
    },
    {
      userId: alice._id,
      blogId: blogs[0]._id,
      content: "You won't regret it Carol, TypeScript is worth every minute!",
      parentComment: topLevelComments[1]._id,
    },
    {
      userId: bob._id,
      blogId: blogs[1]._id,
      content:
        "Great idea, Emma! I'll write a Part 2 covering JWTs and refresh tokens.",
      parentComment: topLevelComments[4]._id,
    },
    {
      userId: david._id,
      blogId: blogs[4]._id,
      content:
        "Absolutely — every production Dockerfile should use multi-stage builds.",
      parentComment: topLevelComments[10]._id,
    },
    {
      userId: emma._id,
      blogId: blogs[8]._id,
      content: "Same story here! Open source is the best resume you can have.",
      parentComment: topLevelComments[15]._id,
    },
    {
      userId: carol._id,
      blogId: blogs[9]._id,
      content:
        "We switched to GitHub Actions last quarter — never looked back.",
      parentComment: topLevelComments[19]._id,
    },
  ]);

  // ── 7. Likes ───────────────────────────────────────────────────────────────
  console.log("❤️  Creating likes...");
  await Like.insertMany([
    // Blog 0
    { userId: bob._id, blogId: blogs[0]._id },
    { userId: carol._id, blogId: blogs[0]._id },
    { userId: david._id, blogId: blogs[0]._id },
    { userId: emma._id, blogId: blogs[0]._id },
    // Blog 1
    { userId: alice._id, blogId: blogs[1]._id },
    { userId: carol._id, blogId: blogs[1]._id },
    { userId: david._id, blogId: blogs[1]._id },
    // Blog 2
    { userId: alice._id, blogId: blogs[2]._id },
    { userId: emma._id, blogId: blogs[2]._id },
    { userId: bob._id, blogId: blogs[2]._id },
    // Blog 3
    { userId: alice._id, blogId: blogs[3]._id },
    { userId: bob._id, blogId: blogs[3]._id },
    { userId: carol._id, blogId: blogs[3]._id },
    { userId: david._id, blogId: blogs[3]._id },
    // Blog 4
    { userId: alice._id, blogId: blogs[4]._id },
    { userId: emma._id, blogId: blogs[4]._id },
    { userId: carol._id, blogId: blogs[4]._id },
    // Blog 5
    { userId: bob._id, blogId: blogs[5]._id },
    { userId: carol._id, blogId: blogs[5]._id },
    { userId: david._id, blogId: blogs[5]._id },
    { userId: emma._id, blogId: blogs[5]._id },
    // Blog 6
    { userId: alice._id, blogId: blogs[6]._id },
    { userId: carol._id, blogId: blogs[6]._id },
    // Blog 7
    { userId: alice._id, blogId: blogs[7]._id },
    { userId: bob._id, blogId: blogs[7]._id },
    { userId: emma._id, blogId: blogs[7]._id },
    { userId: david._id, blogId: blogs[7]._id },
    // Blog 8
    { userId: alice._id, blogId: blogs[8]._id },
    { userId: bob._id, blogId: blogs[8]._id },
    { userId: carol._id, blogId: blogs[8]._id },
    { userId: david._id, blogId: blogs[8]._id },
    // Blog 9
    { userId: alice._id, blogId: blogs[9]._id },
    { userId: emma._id, blogId: blogs[9]._id },
    { userId: bob._id, blogId: blogs[9]._id },
  ]);

  // ── 8. Bookmarks ───────────────────────────────────────────────────────────
  console.log("🔖 Creating bookmarks...");
  await Bookmark.insertMany([
    { userId: bob._id, blogId: blogs[0]._id },
    { userId: carol._id, blogId: blogs[3]._id },
    { userId: david._id, blogId: blogs[4]._id },
    { userId: emma._id, blogId: blogs[1]._id },
    { userId: alice._id, blogId: blogs[4]._id },
    { userId: alice._id, blogId: blogs[8]._id },
    { userId: bob._id, blogId: blogs[7]._id },
    { userId: carol._id, blogId: blogs[8]._id },
    { userId: emma._id, blogId: blogs[5]._id },
    { userId: david._id, blogId: blogs[9]._id },
    { userId: alice._id, blogId: blogs[3]._id },
    { userId: bob._id, blogId: blogs[9]._id },
  ]);

  // ── 9. Follows ─────────────────────────────────────────────────────────────
  console.log("👥 Creating follows...");
  await Follow.insertMany([
    { follower: alice._id, following: bob._id },
    { follower: alice._id, following: emma._id },
    { follower: alice._id, following: david._id },
    { follower: bob._id, following: alice._id },
    { follower: bob._id, following: david._id },
    { follower: carol._id, following: alice._id },
    { follower: carol._id, following: emma._id },
    { follower: carol._id, following: bob._id },
    { follower: david._id, following: bob._id },
    { follower: david._id, following: alice._id },
    { follower: emma._id, following: carol._id },
    { follower: emma._id, following: alice._id },
    { follower: emma._id, following: david._id },
  ]);

  // ── 10. Reports ────────────────────────────────────────────────────────────
  console.log("🚩 Creating reports...");
  await Report.insertMany([
    {
      reportedBy: carol._id,
      blogId: blogs[6]._id,
      reason: "SPAM",
      description:
        "This article appears to be promoting a paid service excessively without disclosure.",
      status: "PENDING",
    },
    {
      reportedBy: david._id,
      blogId: blogs[6]._id,
      reason: "MISINFORMATION",
      description:
        "Some facts in this article are outdated or factually incorrect.",
      status: "REVIEWED",
      reviewedBy: admin._id,
    },
    {
      reportedBy: emma._id,
      blogId: blogs[9]._id,
      reason: "COPYRIGHT_VIOLATION",
      description:
        "Large sections of this article appear to be copied verbatim from another published source.",
      status: "RESOLVED",
      reviewedBy: admin._id,
    },
    {
      reportedBy: alice._id,
      blogId: blogs[7]._id,
      reason: "INAPPROPRIATE_CONTENT",
      description:
        "One section contains content that may not be appropriate for all audiences.",
      status: "DISMISSED",
      reviewedBy: admin._id,
    },
  ]);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed completed successfully!\n");
  console.log("  Collection      Count");
  console.log("  ─────────────────────");
  console.log(`  Users           ${users.length}`);
  console.log(`  Categories      ${categories.length}`);
  console.log(`  Tags            ${tags.length}`);
  console.log(`  Blogs           ${blogs.length}  (1 draft)`);
  console.log(`  Comments        ${topLevelComments.length + 6}  (6 replies)`);
  console.log(`  Likes           34`);
  console.log(`  Bookmarks       12`);
  console.log(`  Follows         13`);
  console.log(`  Reports         4`);
  console.log("\n  Demo credentials (password is the same for all accounts)");
  console.log("  ────────────────────────────────────────────────────────");
  console.log("  Password : Password@123");
  console.log("  Admin    : admin@blogsphere.com  / username: admin");
  console.log("  Users    : alice@blogsphere.com  / username: alicejohnson");
  console.log("             bob@blogsphere.com    / username: bobwilliams");
  console.log("             carol@blogsphere.com  / username: carolsmith");
  console.log("             david@blogsphere.com  / username: davidlee");
  console.log("             emma@blogsphere.com   / username: emmabrown");

  await mongoose.disconnect();
  console.log("\n👋 DB connection closed.\n");
};

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
