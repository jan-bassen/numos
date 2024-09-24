import fs from "fs";
import path from "path";

function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Get the directory of the JSON files
const jsonDir = path.join(process.cwd(), "components/lucide/iconInfo");

// Get all the file names in the directory
const fileNames = fs.readdirSync(jsonDir);

// Start the TypeScript file with an object literal
let tsCode =
  'import { IconAttributes } from "@/lib/types"; export const iconAttributes: IconAttributes = {\n';
const categoriesArray = [];

for (fileName of fileNames) {
  // Read the file
  const fileContents = fs.readFileSync(path.join(jsonDir, fileName), "utf8");

  // Parse the JSON
  const attributes = JSON.parse(fileContents);

  // Get the icon name from the file name
  const iconName = path.basename(fileName, ".json");

  // Add the PascalCase name to the attributes
  attributes.snakeCase = iconName;

  // Add the attributes to the TypeScript code
  tsCode += `  '${toPascalCase(iconName)}': ${JSON.stringify(attributes)},\n`;

  // Add the categories to the categoriesSet
  if (attributes.categories) {
    for (category of attributes.categories) {
      categoriesArray.push(category);
    }
  }
};

// Close the object literal
tsCode += "};\n";

const uniqueCategories = categoriesArray.filter((value, index, self) => {
  return self.indexOf(value) === index;
});

let categoriesCode = "export const iconCategories: string[] = [\n";
for (category of uniqueCategories) {
  categoriesCode += `  '${category}',\n`
}
categoriesCode += "];\n";

// Write the TypeScript code to a file
fs.writeFileSync("components/lucide/iconAttributes.ts", tsCode);
fs.writeFileSync("components/lucide/iconCategories.ts", categoriesCode);
