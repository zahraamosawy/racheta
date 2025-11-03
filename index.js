//index.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT


const app = express();
const drugsRoutes = require("./routers/drugs.routes");
const adminRouter = require("./routers/admin.routes");
const PationtsRoutes = require("./routers/patient.routes");
const visitRouter = require("./routers/visit.routes")

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Server is live..." });
});

app.use("/drugs", drugsRoutes);
app.use("/Patients", PationtsRoutes)
app.use("/admin", adminRouter);
app.use("/visit", visitRouter);

app.listen(PORT, () => {
  console.log(`serve on http://localhost:${PORT}`);
});


//step1 : npm i @prisma/client
//step2 : npm i prisma -D
//step3 : npx prisma init --datasource-provider postgresql
//step4 : get tables form chatgpt to put them on prisma/schema.prisma
//step5 : npx prisma db push
//optional : npx prisma studio

