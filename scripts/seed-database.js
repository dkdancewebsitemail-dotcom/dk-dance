const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

// 1. Manually parse .env.local without external dotenv dependency
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local file not found at:", envPath);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME || "dkdancecompany";
const adminUser = env.ADMIN_USERNAME || "admin";
const adminPass = env.ADMIN_PASSWORD || "dkdc@admin2025";

if (!uri) {
  console.error("❌ MONGODB_URI is not defined in .env.local!");
  process.exit(1);
}

// 2. Data Definitions
const INITIAL_SITE_SETTINGS = {
  siteName: "DK Dance Company",
  tagline: "Learn • Train • Perform • Grow",
  director: "Dhanesh Krishnan",
  headOffice: "Kozhikode, Kerala, India",
  internationalBranch: "Bournemouth, United Kingdom",
  intro:
    "DK Dance Company (DKDC) is a professional dance training institution dedicated to developing dance skills, creativity, confidence, and stage performance. We provide structured dance training for children, teenagers, and adults, from beginners to advanced learners.",
  mission:
    "To inspire, train, and empower every dancer through quality dance education.",
  vision:
    "To build confident performers and create opportunities for dancers to learn, grow, and shine on stage.",
  fees: {
    admissionFee: "₹1,000",
    weeklyOneClassFee: "₹500 / month",
    weeklyTwoClassesFee: "₹800 / month",
    disclaimer:
      "Fees and schedules may vary by branch, program, or special training course. Students should confirm the applicable fee and timetable with the respective branch before admission.",
    paymentNote:
      "Monthly fees should be paid on or before the 10th of every month.",
  },
  onlineClasses: {
    headline: "Learn dance from anywhere in the world",
    description:
      "Access DKDC's world-class training curriculum from the comfort of your home. Our interactive digital sessions deliver individual attention, technical rigor, and artistic development.",
    features: [
      "Basic & Advanced Dance Movements",
      "Rhythm, Timing & Musicality",
      "Body Coordination & Flexibility",
      "Performance Conditioning & Technique",
    ],
  },
  contact: {
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    email: "info@dkdancecompany.com",
    address: "Head Office: Kozhikode, Kerala, India",
    website: "www.dkdancecompany.com",
  },
  socialLinks: {
    instagram: "https://instagram.com/dkdancecompany",
    facebook: "https://facebook.com/dkdancecompany",
    youtube: "https://youtube.com/@dkdancecompany",
    tiktok: "",
  },
  stats: [
    { target: 5000, suffix: "+", label: "Students Trained" },
    { target: 10, suffix: "+", label: "Master Instructors" },
    { target: 6, suffix: "", label: "Studio Spaces" },
    { target: 2, suffix: "", label: "Countries (India & UK)" },
    { target: 100, suffix: "+", label: "Stage Productions" },
    { target: 12, suffix: "+", label: "Years of Legacy" },
  ],
  heroVideoUrl: "/images/videos/8688823-hd_1080_1920_25fps.mp4",
};

const INITIAL_BRANCHES = [
  {
    name: "Kunduparamba",
    slug: "kunduparamba",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "Kunduparamba, Kozhikode, Kerala, India",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Kunduparamba+Kozhikode",
    description:
      "Our Kunduparamba studio offers premier dance training across contemporary, hip-hop, and Bollywood styles for all age groups.",
    classTimings: "Weekly batches available. Please confirm with branch desk.",
    isActive: true,
    displayOrder: 1,
    imageUrl: "/images/branches/kunduparamba.jpg",
  },
  {
    name: "Westhill",
    slug: "westhill",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "Westhill, Kozhikode, Kerala, India",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Westhill+Kozhikode",
    description:
      "Located in Westhill, this branch focuses on foundational technique, rhythm conditioning, and stage performance preparation.",
    classTimings: "Weekend & weekday batches available.",
    isActive: true,
    displayOrder: 2,
    imageUrl: "/images/branches/westhill.jpg",
  },
  {
    name: "Balussery",
    slug: "balussery",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "Balussery, Kozhikode, Kerala, India",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Balussery+Kozhikode",
    description:
      "DKDC Balussery provides comprehensive training programs from beginners to advanced competitive performers.",
    classTimings: "Weekend intensive batches available.",
    isActive: true,
    displayOrder: 3,
    imageUrl: "/images/branches/balussery.jpg",
  },
  {
    name: "Kottooli",
    slug: "kottooli",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "Kottooli, Kozhikode, Kerala, India",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Kottooli+Kozhikode",
    description:
      "Equipped for contemporary, lyrical, and freestyle dance training with spacious dance floors and professional acoustic design.",
    classTimings: "Evening batches available for students & working professionals.",
    isActive: true,
    displayOrder: 4,
    imageUrl: "/images/branches/kottooli.jpg",
  },
  {
    name: "Parambilbazar (Cheruvatta)",
    slug: "parambilbazar",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "Parambilbazar, Cheruvatta, Kozhikode, Kerala, India",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Parambilbazar+Kozhikode",
    description:
      "Serving Cheruvatta and Parambilbazar communities with dedicated classes for children, teenagers, and fitness enthusiasts.",
    classTimings: "Flexible weekly schedule.",
    isActive: true,
    displayOrder: 5,
    imageUrl: "/images/branches/parambilbazar.jpg",
  },
  {
    name: "Bournemouth",
    slug: "bournemouth-uk",
    country: "United Kingdom",
    state: "Dorset",
    city: "Bournemouth",
    address: "Bournemouth, United Kingdom",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "https://maps.google.com/?q=Bournemouth+UK",
    description:
      "Our international branch in the UK brings DKDC's signature movement culture, Indian dance expression, and contemporary choreography to the international stage.",
    classTimings: "International workshop schedules and regular term classes.",
    isActive: true,
    displayOrder: 6,
    imageUrl: "/images/branches/bournemouth.jpg",
  },
];

const DANCE_STYLES = [
  {
    number: "01",
    name: "Bollywood Dance",
    slug: "bollywood",
    tagline: "High Energy • Expression • Cinematic Rhythm",
    description:
      "Blending Indian theatrical expression with contemporary and commercial movement. High-octane choreography designed to build stamina, expressive stage presence, and musicality.",
    image: "/images/styles/bollywood.jpg",
    features: [
      "Cinematic Expression & Storytelling",
      "Dynamic Footwork & Hand Gestures",
      "High-Energy Cardio & Stamina",
      "Folk & Modern Fusion Combinations",
    ],
  },
  {
    number: "02",
    name: "Hip-Hop",
    slug: "hip-hop",
    tagline: "Groove • Isolation • Musical Dynamics",
    description:
      "Authentic urban dance styles focusing on bounce, groove, body isolations, rhythm control, and personal style evolution.",
    image: "/images/styles/hip-hop.jpg",
    features: [
      "Groove Conditioning & Musicality",
      "Body Isolations & Popping Foundations",
      "Freestyle Dynamics & Battle Presence",
      "Fast-Paced Contemporary Choreography",
    ],
  },
  {
    number: "03",
    name: "Contemporary Dance",
    slug: "contemporary",
    tagline: "Fluidity • Floorwork • Emotional Depth",
    description:
      "An artistic exploration of momentum, gravity, contraction, release, and fluid transitions between vertical and horizontal movement.",
    image: "/images/styles/contemporary.jpg",
    features: [
      "Floorwork & Weight Transfer",
      "Breath Control & Momentum",
      "Contraction, Release & Suspension",
      "Improvisation & Story Interpretation",
    ],
  },
  {
    number: "04",
    name: "Lyrical Dance",
    slug: "lyrical",
    tagline: "Poetry • Emotion • Precision",
    description:
      "Merging technical precision with raw storytelling. Dancers translate lyrics, melodies, and emotional narratives into expressive kinetic art.",
    image: "/images/styles/lyrical.jpg",
    features: [
      "Lyric Interpretation & Musical Nuance",
      "Controlled Extensions & Balances",
      "Seamless Kinetic Flow",
      "Deep Thematic Performance",
    ],
  },
  {
    number: "05",
    name: "Western Dance",
    slug: "western",
    tagline: "Showmanship • Precision • Stagecraft",
    description:
      "Commercial western stage routines combining jazz technique, synchronization, stage presence, and precision ensemble performance.",
    image: "/images/styles/western.jpg",
    features: [
      "Ensemble Synchronization & Line Discipline",
      "Stage Spatial Awareness",
      "Turn & Leap Formations",
      "Commercial Performance Standards",
    ],
  },
  {
    number: "06",
    name: "Freestyle Dance",
    slug: "freestyle",
    tagline: "Authenticity • Improvisation • Versatility",
    description:
      "Empowering dancers to break free from choreographic boundaries, trust their muscle memory, and respond authentically to any beat in real-time.",
    image: "/images/styles/freestyle.jpg",
    features: [
      "Spontaneous Rhythm Adaptation",
      "Individual Signature Moves",
      "Fearless Improvisation Drills",
      "Multi-Genre Musical Blending",
    ],
  },
];

const SPECIAL_TRAINING_MODULES = [
  {
    title: "Basic Dance Movements",
    desc: "Foundational postures, balance alignment, weight shifting, and primary movement planes.",
  },
  {
    title: "Footwork Training",
    desc: "Agility drills, syncopated speed patterns, grounded heel-toe transfers, and rhythmic clarity.",
  },
  {
    title: "Tutting",
    desc: "Geometric arm, wrist, and finger choreography exploring precise 90-degree angles and illusions.",
  },
  {
    title: "Body Flexibility",
    desc: "Safe anatomical lengthening, range-of-motion expansion, and joint mobility enhancement.",
  },
  {
    title: "Stretching Exercises",
    desc: "Dynamic and PNF stretching routines designed to prevent injury and sustain athletic agility.",
  },
  {
    title: "Acrobatics & Movement Skills",
    desc: "Safe floor flips, rolls, aerial weight transfers, and acrobatic transitions into choreography.",
  },
];

const INITIAL_VIDEOS = [
  {
    type: "video",
    title: "DKDC Stage Choreography & Kinetic Routine",
    category: "Performances",
    description: "Cinematic contemporary stage choreography showcase directed by Dhanesh Krishnan.",
    url: "/images/videos/8688453-hd_1920_1080_25fps.mp4",
    thumbnailUrl: "/images/styles/contemporary.jpg",
    duration: "0:45",
    featuredOnHome: true,
    published: true,
    displayOrder: 1,
  },
  {
    type: "video",
    title: "Hip-Hop Urban Freestyle & Isolation Reel",
    category: "Classes",
    description: "Advanced rhythm isolation and speed footwork intensive at Kozhikode head studio.",
    url: "/images/videos/8688823-hd_1080_1920_25fps.mp4",
    thumbnailUrl: "/images/styles/hip-hop.jpg",
    duration: "0:30",
    featuredOnHome: true,
    published: true,
    displayOrder: 2,
  },
];

const INITIAL_GALLERY_ITEMS = [
  {
    type: "image",
    title: "Stage Choreography Showcase",
    category: "Performances",
    description: "DKDC senior company dancers performing contemporary routine.",
    url: "/images/styles/lyrical.jpg",
    published: true,
    displayOrder: 1,
  },
  {
    type: "image",
    title: "Hip-Hop Intensive Workshop",
    category: "Workshops",
    description: "Studio session exploring isolation techniques and rhythm grooves.",
    url: "/images/styles/hip-hop.jpg",
    published: true,
    displayOrder: 2,
  },
  {
    type: "image",
    title: "Bournemouth UK Cultural Exchange",
    category: "Bournemouth",
    description: "International collaboration and masterclass sessions in Bournemouth, UK.",
    url: "/images/branches/bournemouth.jpg",
    published: true,
    displayOrder: 3,
  },
  {
    type: "image",
    title: "Annual Stage Extravaganza",
    category: "Stage Shows",
    description: "Lighting and synchronization during our Kozhikode grand stage show.",
    url: "/images/styles/western.jpg",
    published: true,
    displayOrder: 4,
  },
  {
    type: "image",
    title: "Studio Movement & Flexibility Training",
    category: "Special Training",
    description: "Students conditioning acrobatics and stretching drills.",
    url: "/images/branches/westhill.jpg",
    published: true,
    displayOrder: 5,
  },
  {
    type: "image",
    title: "State Level Dance Championship",
    category: "Competitions",
    description: "DKDC competition team performing winning routine.",
    url: "/images/styles/bollywood.jpg",
    published: true,
    displayOrder: 6,
  },
  {
    type: "image",
    title: "Contemporary Fluidity Practice",
    category: "Classes",
    description: "Technical contemporary session exploring breath and floor transitions.",
    url: "/images/styles/contemporary.jpg",
    published: true,
    displayOrder: 7,
  },
  {
    type: "image",
    title: "Ensemble Formation & Precision",
    category: "Performances",
    description: "Synchronized group choreography rehearsals.",
    url: "/images/branches/balussery.jpg",
    published: true,
    displayOrder: 8,
  },
];

const INITIAL_REVIEWS = [
  {
    author: "Anusree K.",
    avatarLetter: "A",
    avatarBg: "bg-[#EA4335]",
    badge: "Local Guide • 24 reviews",
    rating: 5,
    timeAgo: "2 weeks ago",
    text: "DK Dance Company is undeniably the best dance academy in Kozhikode! Dhanesh master's teaching methodology is simply exceptional. My daughter joined as a complete beginner and her stage presence and confidence have skyrocketed. The studio vibe is super energetic and disciplined!",
    published: true,
    displayOrder: 1,
  },
  {
    author: "Rahul Menon",
    avatarLetter: "R",
    avatarBg: "bg-[#4285F4]",
    badge: "8 reviews",
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "Outstanding choreography and very disciplined training. The faculty pays personal attention to every single dancer, focusing heavily on footwork and musicality. Their annual stage mega-show was executed with pure international standards. Highly recommend DKDC to anyone passionate about dance!",
    published: true,
    displayOrder: 2,
  },
  {
    author: "Dr. Fathima Zahra",
    avatarLetter: "F",
    avatarBg: "bg-[#34A853]",
    badge: "Local Guide • 42 reviews",
    rating: 5,
    timeAgo: "1 month ago",
    text: "I joined the adult batch for fitness and contemporary dance after work. It has been the best decision! The workouts, body isolations, and choreography routines are therapeutic. Dhanesh sir and the team ensure everyone feels welcomed regardless of age or experience.",
    published: true,
    displayOrder: 3,
  },
  {
    author: "Deepak Nambiar",
    avatarLetter: "D",
    avatarBg: "bg-[#FBBC05] text-neutral-900 font-medium",
    badge: "5 reviews",
    rating: 5,
    timeAgo: "1 month ago",
    text: "The best dance studio in Calicut for Hip-hop, Western, and Cinematic choreography. The mentors break down complex routines step-by-step. The energy in the studio is contagious. Dhanesh Krishnan sir is truly an inspiration to all upcoming artists in Kerala.",
    published: true,
    displayOrder: 4,
  },
  {
    author: "Sneha Varma",
    avatarLetter: "S",
    avatarBg: "bg-[#9C27B0]",
    badge: "Local Guide • 19 reviews",
    rating: 5,
    timeAgo: "2 months ago",
    text: "Enrolled both my kids at DKDC last year. The improvement in their physical coordination, rhythm, and stage confidence is incredible. Wonderful faculty, clean & spacious dance floors, and very transparent communication with parents. 5 stars all the way!",
    published: true,
    displayOrder: 5,
  },
];

async function seed() {
  console.log("🔄 Connecting to MongoDB database...");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    const db = client.db(dbName);
    const now = new Date().toISOString();

    // 1. Seed siteSettings
    const settingsCount = await db.collection("siteSettings").countDocuments();
    if (settingsCount === 0) {
      await db.collection("siteSettings").insertOne({
        ...INITIAL_SITE_SETTINGS,
        createdAt: now,
        updatedAt: now,
      });
      console.log("✅ Seeded siteSettings (1 document)");
    } else {
      console.log(`ℹ️ siteSettings already contains ${settingsCount} document(s). Skipping.`);
    }

    // 2. Seed branches
    const branchesCount = await db.collection("branches").countDocuments();
    if (branchesCount === 0) {
      const branchesWithDates = INITIAL_BRANCHES.map((b) => ({
        ...b,
        createdAt: now,
        updatedAt: now,
      }));
      const res = await db.collection("branches").insertMany(branchesWithDates);
      console.log(`✅ Seeded branches (${res.insertedCount} locations)`);
    } else {
      console.log(`ℹ️ branches already contains ${branchesCount} document(s). Skipping.`);
    }

    // 3. Seed dance_styles
    const stylesCount = await db.collection("dance_styles").countDocuments();
    if (stylesCount === 0) {
      const stylesWithDates = DANCE_STYLES.map((s, i) => ({
        ...s,
        displayOrder: i + 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }));
      const res = await db.collection("dance_styles").insertMany(stylesWithDates);
      console.log(`✅ Seeded dance_styles (${res.insertedCount} styles)`);
    } else {
      console.log(`ℹ️ dance_styles already contains ${stylesCount} document(s). Skipping.`);
    }

    // 4. Seed curriculum
    const curriculumCount = await db.collection("curriculum").countDocuments();
    if (curriculumCount === 0) {
      const curriculumWithDates = SPECIAL_TRAINING_MODULES.map((m, i) => ({
        ...m,
        badge: "CONDITIONING",
        displayOrder: i + 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }));
      const res = await db.collection("curriculum").insertMany(curriculumWithDates);
      console.log(`✅ Seeded curriculum (${res.insertedCount} modules)`);
    } else {
      console.log(`ℹ️ curriculum already contains ${curriculumCount} document(s). Skipping.`);
    }

    // 5. Seed reviews
    const reviewsCount = await db.collection("reviews").countDocuments();
    if (reviewsCount === 0) {
      const reviewsWithDates = INITIAL_REVIEWS.map((r, i) => ({
        ...r,
        createdAt: now,
        updatedAt: now,
      }));
      const res = await db.collection("reviews").insertMany(reviewsWithDates);
      console.log(`✅ Seeded reviews (${res.insertedCount} reviews)`);
    } else {
      console.log(`ℹ️ reviews already contains ${reviewsCount} document(s). Skipping.`);
    }

    // 6. Seed media (gallery photos + videos)
    const mediaCount = await db.collection("media").countDocuments();
    if (mediaCount === 0) {
      const allMedia = [...INITIAL_GALLERY_ITEMS, ...INITIAL_VIDEOS].map((m) => ({
        ...m,
        createdAt: now,
        updatedAt: now,
      }));
      const res = await db.collection("media").insertMany(allMedia);
      console.log(`✅ Seeded media (${res.insertedCount} items: ${INITIAL_GALLERY_ITEMS.length} photos, ${INITIAL_VIDEOS.length} videos)`);
    } else {
      console.log(`ℹ️ media already contains ${mediaCount} document(s). Skipping.`);
    }

    // 7. Seed admin_users
    const adminCount = await db.collection("admin_users").countDocuments();
    if (adminCount === 0) {
      const passwordHash = bcrypt.hashSync(adminPass, 10);
      await db.collection("admin_users").insertOne({
        username: adminUser,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`✅ Seeded admin_users (User: "${adminUser}")`);
    } else {
      console.log(`ℹ️ admin_users already contains ${adminCount} administrator(s). Skipping.`);
    }

    console.log("\n🎉 Database setup & seeding completed successfully!");
  } catch (err) {
    console.error("❌ Database seeding failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();

