const fs = require("fs");
const path = require("path");

const dbDir = path.join(process.cwd(), "database");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

module.exports = {
  getData: (fileName, guildId) => {
    const filePath = path.join(dbDir, `${fileName}.json`);

    if (!fs.existsSync(filePath)) return null;

    const db = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return db[guildId] || null;
  },

  setData: (fileName, guildId, data) => {
    const filePath = path.join(dbDir, `${fileName}.json`);

    let db = {};

    if (fs.existsSync(filePath)) {
      db = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    db[guildId] = { ...db[guildId], ...data };

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  },
};
