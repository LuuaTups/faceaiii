const fs = require("fs");
const path = require("path");

function patchExpoRouter() {
  const filePath = path.resolve("node_modules/expo-router/_ctx.web.tsx");

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  expo-router _ctx.web.tsx not found, skipping patch");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Check if already patched
  if (content.includes("require.context('../../app'")) {
    console.log("✅ expo-router _ctx.web.tsx already patched");
    return;
  }

  // Apply the patch
  const patchedContent = content.replace(
    /require\.context\(process\.env\.EXPO_ROUTER_APP_ROOT/g,
    "require.context('../../app'"
  );

  // Safety check
  if (patchedContent === content) {
    console.log("⚠️  Pattern not found in _ctx.web.tsx — no changes made");
    return;
  }

  fs.writeFileSync(filePath, patchedContent, "utf8");
  console.log("✅ Successfully patched expo-router _ctx.web.tsx");
}

try {
  patchExpoRouter();
} catch (err) {
  console.error("❌ Failed to patch expo-router _ctx.web.tsx:", err);
  process.exit(1);
}
