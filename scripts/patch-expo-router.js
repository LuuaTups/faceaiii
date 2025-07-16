const fs = require("fs");
const path = require("path");

const filePath = path.resolve("node_modules/expo-router/_ctx.web.tsx");

try {
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  expo-router _ctx.web.tsx not found, skipping patch");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Check if already patched
  if (content.includes("require.context('../app'")) {
    console.log("✅ expo-router _ctx.web.tsx already patched");
    return;
  }

  // Apply the patch
  content = content.replace(
    /require\.context\(process\.env\.EXPO_ROUTER_APP_ROOT/g,
    "require.context('../../app'"
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Patched expo-router _ctx.web.tsx");
} catch (err) {
  console.error("❌ Failed to patch expo-router _ctx.web.tsx:", err);
}