const express = require("express");
const app = express();
require("./db/Conn");
const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 5000;
const user = require("./models/User");
const puppeteer = require('puppeteer');
const PDFMerger = require('pdf-merger-js');
const fs = require('fs');
const public_path = path.join(__dirname, "../public");
const dotenv = require("dotenv");

dotenv.config();
const cloudinary = require("./cloudinary");
const multer = require("./multer");
const { time } = require("console");
const { formToJSON } = require("axios");
const merger = new PDFMerger();
app.use(express.static(public_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const views_path = path.join(__dirname, "../views");
const partials_path = path.join(__dirname, "../views/partials");
app.set("views", views_path);
app.set("view engine", "hbs");
hbs.registerPartials(partials_path);
app.use(express.static(public_path));

app.get("/", (req, res) => {
  res.render("home");
})
app.get("/signin", (req, res) => {
    res.render("signin"); // render the "signin" view from the "views" directory
});

app.post("/signin", async (req, res) => {
    try {
      const name = req.body.username;
      const pass = req.body.pwd;
  
      const data = await user.find({ $and: [{ username: name }, { password: pass }] })
  
      if (!data.length) {
        res.send("Invalid Username or Password!");
      } else {
        res.status(200).render("form");
      }
    }
    catch (err) {
      console.log(err);
    }
})

app.get("/signup", (req, res) => {
    res.render("signup");
  })
  
  app.post("/signup", async (req, res) => {
    try {
      urname = req.body.username;
      pass = req.body.pwd;
      cpass = req.body.cpwd;
  
      const data = await user.find({username: urname });
      if(data.length) {
        res.render("signuperror");
      }
  
      if (pass === cpass) {
        const User = new user({
          username: urname,
          password: pass,
        });
  
        await User.save();
        res.status(200).render("signin");
      } else {
        res.send("Password is not same!");
      }
    } catch (err) {
      console.log(err);
    }
  });

const generatePDF = async (website_url)=> {
    // Create a browser instance
    const browser = await puppeteer.launch();
    // Create a new page
    const page = await browser.newPage();
  
    // Open URL in current page
    await page.goto(website_url, { waitUntil: "networkidle0" });
  
    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");
  
    // Downlaod the PDF
    // let p = website_url+".pdf"
    const pdf = await page.pdf({
      // path: "output.pdf",
      // margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });
  
    // Close the browser instance
    await browser.close();
    return pdf;
}

app.get('/form', (req, res) => {
    res.render("2_doc", { sub_name: 'CSPC-201 Digital Circuits and Logic Design', programme: 'B Tech', sem: '6' });
});

let subVal = "";
let progval = "";
let branchVal = "";
let semVal = "";
let  teacherName = "";
let designation = "";
let progOp = "";
let branchOp = "";
let semOp = "";
let subOp = "";
let courseCode = "";
let startMonth = "";
let endMonth = "";
let year = "";

let time_table= "";
let lect_plan = "";
let q_paper = "";
let assig = "";
let summary_sheet = "";
let attend = "";
let pdfName = "";
let marks = "";

app.get("/last", (req, res)=>{
    res.render("thanku");
  })
  
app.post("/view1", async (req, res)=>{
    let outputFile = path.join(__dirname , "/../");
    // window.open("D:/btech/6th Sem/minorproject/pdf_maker/src/merged.pdf", "_blank");
    outputFile = outputFile+ await pdfName;
    pdfName="";
    res.sendFile(outputFile,  { headers: {'Content-Type': 'application/pdf'} })

 })
  

app.post("/form", async (req, res) => {
    try {
  
      //documents
      time_table = req.body.timeTable;
      lect_plan = req.body.lecturePlan;
      pdfName = req.body.pdfNameField;
      marks = req.body.marksheet;
      attend = req.body.attendance;
      assig = req.body.assignments;
      q_paper = req.body.qpaper;
      summary_sheet = req.body.summary;
     
      //Teacher Name
      teacherName = req.body.teacherName;
     
      //Designation
      designation = req.body.designation;
    
      // programme name
      progOp = req.body.programme;
  
      if (progOp == 1) progval = "BSc";
      else if (progOp == 2) progval = "BTech";
      else if (progOp == 3) progval = "MTech";
      else if (progOp == 4) progval = "PHD";
      else if (progOp == 5) progval = "MSc";
  
  
      // branch name
      branchOp = req.body.branch;
  
      if (branchOp == 1) branchVal = "BT";
      else if (branchOp == 2) branchVal = "CHE";
      else if (branchOp == 3) branchVal = "CE";
      else if (branchOp == 4) branchVal = "CSE";
      else if (branchOp == 5) branchVal = "EE";
      else if (branchOp == 6) branchVal = "ECE";
      else if (branchOp == 7) branchVal = "IPE";
      else if (branchOp == 8) branchVal = "IT";
      else if (branchOp == 9) branchVal = "ICE";
      else if (branchOp == 10) branchVal = "ME";
      else if (branchOp == 11) branchVal = "TT";
  
  
       //semester
       semOp = req.body.semester;
  
       if (semOp == 1) semVal = "1st";
       else if (semOp == 2) semVal = "2nd";
       else if (semOp == 3) semVal = "3rd";
       else if (semOp == 4) semVal = "4th";
       else if (semOp == 5) semVal = "5th";
       else if (semOp == 6) semVal = "6th";
       else if (semOp == 7) semVal = "7th";
       else if (semOp == 8) semVal = "8th";
      
  
      // subject Name
      subOp = req.body.subField;
  
      if (subOp == 1) subVal = "Computer Networks";
      else if (subOp == 2) subVal = "Digital Circuits and Logic Design";
      else if (subOp == 3) subVal = "DataBase Management System";
      else if (subOp == 4) subVal = "Data Structures and Algorithms";
      else if (subOp == 5) subVal = "Machine Learning";
  
  
      //courseCode
      courseCode = req.body.courseCode;
      
      //start month
      startMonth = req.body.startMonth;
   
      //end month
      endMonth = req.body.endMonth;
  
      //year
      year = req.body.year;

    } catch (err) {
      console.log(err);
    }
    const root_url = "http://localhost:5000";
    let syllabus = path.join(__dirname , "/syllabus/")  + subVal+".pdf";
  
    const urls = ["/1_doc", "/2_doc", "/10_doc"];
    let temp = path.join(__dirname , "/pg34.pdf");
    const pdfs = [temp];
    let path1 = root_url + urls[0];
    let path2 = root_url + urls[1];
    let path3 = root_url + urls[2];
    let p1 = await generatePDF(path1);
    await merger.add(p1);
    let p2 = await generatePDF(path2);
    await merger.add(p2);
    await merger.add(pdfs[0]);
    await merger.add(syllabus);
    if(time_table!="" || time_table!=undefined) await merger.add(__dirname + "/" +  time_table);
    if(lect_plan!="" || lect_plan!=undefined) await merger.add(lect_plan);
    if(attend!="" || attend!= undefined) await merger.add(attend);
    if(assig!="" || assig!=undefined) await merger.add(assig);
    if(q_paper!="" || q_paper!=undefined) await merger.add(q_paper);
    // if(q_paper!=null || q_paper!=undefined) await merger.add(q_paper);
    if(marks!="" || marks!=undefined) await merger.add(marks);
    if(summary_sheet!="" || summary_sheet!=undefined) await merger.add(summary_sheet);
    let p3 = await generatePDF(path3);
  
    await merger.add(p3);
    const mergedPdf = await merger.saveAsBuffer();
    console.log(mergedPdf);
    pdfName += ".pdf";
    console.log(pdfName);
    fs.writeFileSync(pdfName, mergedPdf);
    res.render("thanku");
    // pdfName="";
});
  

app.get("/2_doc", (req, res) => {
    res.render("2_doc", {
      sub_name: subVal,
      programme: progval,
      branch: branchVal,
      semester: semVal,
    });
  });
  
  app.get("/10_doc", (req, res) => {
    res.render("10_doc");
  });
  
  app.listen(port, () => {
    console.log("server running on port : 5000");
  });


  app.get("/1_doc", (req, res) => {
    res.render("1_doc",{
      subName: subVal,
      courseCode : courseCode,
      programme: progval,
      branch: branchVal,
      semester: semVal,
      startMonth : startMonth,
      endMonth : endMonth,
      year : year,
      teacherName : teacherName,
      post : designation
    });
  });
  