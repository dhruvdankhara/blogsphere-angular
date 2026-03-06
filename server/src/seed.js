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
  console.log("📝 Creating blogs...");
  const blogs = await Blog.insertMany([
    // 0
    {
      userId: alice._id,
      title: "Getting Started with TypeScript in 2025",
      slug: "getting-started-with-typescript-2025",
      featureImage: "https://picsum.photos/seed/typescript2025/1200/630",
      content: `<h2>Why TypeScript?</h2>
<p>TypeScript has taken the JavaScript world by storm. With its strong typing system it helps developers catch bugs early, write cleaner code, and scale large applications with confidence.</p>
<h2>Setting Up</h2>
<p>Install TypeScript globally: <code>npm install -g typescript</code>. Then initialise a project with <code>tsc --init</code> to generate a <code>tsconfig.json</code>.</p>
<h2>Basic Types</h2>
<p>TypeScript supports all JavaScript types plus extras like <code>tuple</code>, <code>enum</code>, <code>unknown</code> and <code>never</code>. Start with simple annotations and gradually adopt more advanced features.</p>
<h2>Interfaces vs Types</h2>
<p>Use <code>interface</code> for object shapes that may be extended. Use <code>type</code> for unions, intersections and aliased primitives. Both are valid — consistency matters more than the choice itself.</p>
<h2>Conclusion</h2>
<p>Adopting TypeScript is one of the best investments you can make in your codebase. The initial learning curve pays off when maintaining large teams and complex projects.</p>`,
      category: webdevCat._id,
      tags: [tsTag._id, jsTag._id],
      isPublic: true,
      isDraft: false,
      visits: 342,
    },
    // 1
    {
      userId: bob._id,
      title: "Building REST APIs with Node.js and Express",
      slug: "building-rest-apis-nodejs-express",
      featureImage: "https://picsum.photos/seed/nodejs-api/1200/630",
      content: `<h2>Introduction</h2>
<p>Node.js combined with Express is one of the most popular stacks for building REST APIs. It is lightweight, fast and has a huge ecosystem.</p>
<h2>Project Setup</h2>
<p>Start with <code>npm init -y</code> and install Express: <code>npm install express</code>. Create an <code>app.js</code> and set up your base server.</p>
<h2>Routing</h2>
<p>Express makes routing simple. Use <code>app.get()</code>, <code>app.post()</code>, <code>app.put()</code> and <code>app.delete()</code> to handle HTTP methods. Organise routes into separate router files.</p>
<h2>Middleware</h2>
<p>Middleware functions are the backbone of Express. Use them for logging, authentication, validation and error handling.</p>
<h2>Error Handling</h2>
<p>Always add a global error-handling middleware at the end of your middleware chain. It catches any error passed to <code>next(err)</code>.</p>
<h2>Final Thoughts</h2>
<p>Node.js + Express remains a rock-solid choice for APIs. Pair it with MongoDB for a powerful MERN-compatible backend.</p>`,
      category: webdevCat._id,
      tags: [nodeTag._id, jsTag._id],
      isPublic: true,
      isDraft: false,
      visits: 518,
    },
    // 2
    {
      userId: carol._id,
      title: "The Principles of Great UI Design",
      slug: "principles-of-great-ui-design",
      featureImage: "https://picsum.photos/seed/uidesign/1200/630",
      content: `<h2>Less is More</h2>
<p>Minimalism is not just a trend — it is a principle. Remove everything that does not serve the user's need. Every element on screen should have a clear purpose.</p>
<h2>Consistency</h2>
<p>Consistent design reduces cognitive load. Use the same colours, fonts and interaction patterns throughout your product.</p>
<h2>Feedback and Affordance</h2>
<p>Users need to know when something happens. Whether it is a button press or a form submission, always provide clear visual or auditory feedback.</p>
<h2>Hierarchy</h2>
<p>Visual hierarchy guides the user's eye. Use size, weight and colour contrast to make the most important elements stand out.</p>
<h2>Accessibility First</h2>
<p>Design for everyone. Sufficient colour contrast, keyboard navigability and ARIA labels ensure your product works for users with disabilities.</p>`,
      category: designCat._id,
      tags: [cssTag._id],
      isPublic: true,
      isDraft: false,
      visits: 276,
    },
    // 3
    {
      userId: emma._id,
      title: "Introduction to Machine Learning with Python",
      slug: "introduction-to-machine-learning-python",
      featureImage: "https://picsum.photos/seed/machinelearning/1200/630",
      content: `<h2>What is Machine Learning?</h2>
<p>Machine learning is a subset of AI that gives systems the ability to learn from data without being explicitly programmed.</p>
<h2>Setting Up Your Environment</h2>
<p>Install the core libraries: <code>pip install numpy pandas scikit-learn matplotlib</code>. Always use a virtual environment.</p>
<h2>Your First Model</h2>
<p>Start with linear regression on a housing dataset. Load data with Pandas, preprocess it, then fit a model using scikit-learn's <code>LinearRegression</code>.</p>
<h2>Evaluation</h2>
<p>Use metrics like Mean Squared Error (MSE) and R² score to evaluate performance on a held-out test set.</p>
<h2>Next Steps</h2>
<p>Once comfortable with the basics, explore classification algorithms, random forests, and deep learning with TensorFlow or PyTorch.</p>`,
      category: dsCat._id,
      tags: [pythonTag._id, mlTag._id],
      isPublic: true,
      isDraft: false,
      visits: 621,
    },
    // 4
    {
      userId: david._id,
      title: "Docker for Developers: A Practical Guide",
      slug: "docker-for-developers-practical-guide",
      featureImage: "https://picsum.photos/seed/dockerguide/1200/630",
      content: `<h2>What is Docker?</h2>
<p>Docker is a containerisation platform that lets you package applications and their dependencies into isolated containers that run anywhere.</p>
<h2>Core Concepts</h2>
<p>Images are blueprints; containers are running instances. Volumes persist data. Networks connect containers to each other.</p>
<h2>Writing a Dockerfile</h2>
<p>Start with a base image, copy your code, install dependencies and define the startup command with <code>CMD</code> or <code>ENTRYPOINT</code>.</p>
<h2>Docker Compose</h2>
<p>Define multi-container applications in a single YAML file and spin up your entire stack — app, database, cache — with <code>docker compose up</code>.</p>
<h2>Tips for Production</h2>
<p>Use multi-stage builds to keep images small, never hardcode secrets in a Dockerfile, and scan images for vulnerabilities regularly.</p>`,
      category: devopsCat._id,
      tags: [dockerTag._id],
      isPublic: true,
      isDraft: false,
      visits: 489,
    },
    // 5
    {
      userId: alice._id,
      title: "Angular vs React: Which One Should You Choose?",
      slug: "angular-vs-react-which-should-you-choose",
      featureImage: "https://picsum.photos/seed/angularvsreact/1200/630",
      content: `<h2>Overview</h2>
<p>Both Angular and React are industry-leading tools for building web applications. The right choice depends on team size, project scale and preferences.</p>
<h2>Angular</h2>
<p>Angular is a full-featured framework from Google. It comes batteries-included with routing, HTTP client, reactive forms and a powerful CLI. Best for large enterprise apps.</p>
<h2>React</h2>
<p>React is a UI library from Meta. Its minimal footprint means you compose your own stack, giving flexibility but requiring more upfront decisions.</p>
<h2>Performance</h2>
<p>Both are performant with proper optimisation. React's virtual DOM and Angular's zone-based change detection are efficient at scale.</p>
<h2>Verdict</h2>
<p>For large teams building complex enterprise software, Angular's structure is a huge asset. For smaller teams valuing flexibility, React is an excellent choice.</p>`,
      category: webdevCat._id,
      tags: [angularTag._id, reactTag._id, tsTag._id],
      isPublic: true,
      isDraft: false,
      visits: 735,
    },
    // 6
    {
      userId: bob._id,
      title: "Open Source Contribution: A Beginner's Roadmap",
      slug: "open-source-contribution-beginners-roadmap",
      featureImage: "https://picsum.photos/seed/opensource/1200/630",
      content: `<h2>Why Contribute?</h2>
<p>Open source contributions sharpen your skills, build your portfolio, grow your network and give back to the tools you rely on every day.</p>
<h2>Finding the Right Project</h2>
<p>Start with projects you actually use. Look for issues labelled <em>good first issue</em> or <em>help wanted</em> on GitHub.</p>
<h2>Making Your First PR</h2>
<p>Fork the repo, create a feature branch, make your change, write or update tests, then open a pull request with a clear description.</p>
<h2>Communication is Key</h2>
<p>Be respectful, patient and open to feedback. Maintainers are often volunteers. A good PR comment thread is as important as the code itself.</p>`,
      category: techCat._id,
      tags: [osTag._id],
      isPublic: true,
      isDraft: false,
      visits: 214,
    },
    // 7
    {
      userId: carol._id,
      title: "10 CSS Tricks Every Frontend Developer Should Know",
      slug: "10-css-tricks-every-frontend-developer",
      featureImage: "https://picsum.photos/seed/csstricks/1200/630",
      content: `<h2>1. CSS Grid for Layouts</h2>
<p>CSS Grid is the native way to build two-dimensional layouts. <code>display: grid</code> is your best friend for complex page structures.</p>
<h2>2. Custom Properties (Variables)</h2>
<p>Define reusable values with <code>--my-color: #333</code> and reference them with <code>var(--my-color)</code>.</p>
<h2>3. :is() and :where()</h2>
<p>Reduce repetitive selectors. Instead of <code>h1, h2, h3</code>, write <code>:is(h1, h2, h3)</code>.</p>
<h2>4. Clamp for Responsive Typography</h2>
<p>Use <code>font-size: clamp(1rem, 2.5vw, 2rem)</code> for fluid typography without any media queries.</p>
<h2>5. Scroll Snap</h2>
<p>Create buttery-smooth snapping scroll experiences with <code>scroll-snap-type</code> and <code>scroll-snap-align</code>.</p>
<h2>6. Logical Properties</h2>
<p>Use <code>margin-inline</code>, <code>padding-block</code> etc. to write direction-agnostic styles that work in RTL layouts too.</p>`,
      category: webdevCat._id,
      tags: [cssTag._id, jsTag._id],
      isPublic: true,
      isDraft: false,
      visits: 812,
    },
    // 8
    {
      userId: emma._id,
      title: "How to Land Your First Developer Job",
      slug: "how-to-land-your-first-developer-job",
      featureImage: "https://picsum.photos/seed/devjob/1200/630",
      content: `<h2>Build a Portfolio</h2>
<p>Nothing speaks louder than working projects. Build 3–5 real-world projects and host them online. Include a GitHub link and a live demo for each.</p>
<h2>Contribute to Open Source</h2>
<p>Open source contributions demonstrate collaboration, code quality and initiative. Pick a project you use and start with documentation or a small bug fix.</p>
<h2>Nail the Technical Interview</h2>
<p>Practice data structures and algorithms on LeetCode or HackerRank. Focus on arrays, strings, trees and graphs. Review basic system design concepts.</p>
<h2>Network Actively</h2>
<p>Attend meetups, join developer Discord communities and connect on LinkedIn. Many jobs are filled through referrals before they are ever posted publicly.</p>
<h2>Never Stop Learning</h2>
<p>The tech industry evolves fast. Block time each week for learning — follow blogs, take courses and build side projects to keep skills sharp.</p>`,
      category: careerCat._id,
      tags: [careerTag._id, osTag._id],
      isPublic: true,
      isDraft: false,
      visits: 963,
    },
    // 9
    {
      userId: david._id,
      title: "CI/CD Pipeline Best Practices",
      slug: "cicd-pipeline-best-practices",
      featureImage: "https://picsum.photos/seed/cicd/1200/630",
      content: `<h2>What is CI/CD?</h2>
<p>Continuous Integration (CI) merges code changes frequently and runs automated tests. Continuous Delivery (CD) automates releases so you can deploy confidently at any time.</p>
<h2>Key Pipeline Stages</h2>
<p>A solid pipeline covers: build, lint, unit tests, integration tests, security scan, Docker image build, push to registry, and deploy.</p>
<h2>Keep It Fast</h2>
<p>Slow pipelines kill developer productivity. Parallelise test suites, cache dependencies and prune unnecessary steps aggressively.</p>
<h2>Tools</h2>
<p>Popular options include GitHub Actions, GitLab CI, Jenkins and CircleCI. Choose the one that integrates best with your existing toolchain.</p>
<h2>Shift Left on Security</h2>
<p>Add SAST and dependency vulnerability scanning early in the pipeline. Fixing security issues before merge is far cheaper than fixing them in production.</p>`,
      category: devopsCat._id,
      tags: [dockerTag._id, k8sTag._id],
      isPublic: true,
      isDraft: false,
      visits: 307,
    },
    // 10 — draft
    {
      userId: alice._id,
      title: "Deep Dive into React Hooks",
      slug: "deep-dive-into-react-hooks",
      content: `<h2>Draft — Work in Progress</h2>
<p>This article is not finished yet. Coming soon: useState, useEffect, useContext, useReducer, custom hooks and best practices.</p>`,
      category: webdevCat._id,
      tags: [reactTag._id, jsTag._id],
      isPublic: false,
      isDraft: true,
      visits: 0,
    },
  ]);

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
