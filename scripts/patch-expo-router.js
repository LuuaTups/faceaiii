const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
  "node_modules/expo-router/_ctx.web.tsx"
);

try {
  // Check if the file exists before trying to read it
  if (!fs.existsSync(filePath)) {
    console.warn("⚠️ expo-router _ctx.web.tsx not found, skipping patch");
    process.exit(0);
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Replace the problematic line using a regex
  const newContent = content.replace(
    /require\.context\(\s*process\.env\.EXPO_ROUTER_APP_ROOT\s*,/,
    "require.context('../app',"
  );

  if (newContent === content) {
    console.warn("⚠️ No replacement made — pattern not found.");
  } else {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log("✅ Successfully patched expo-router _ctx.web.tsx");
  }
} catch (err) {
  console.error("❌ Error patching expo-router:", err);
  process.exit(1);
}