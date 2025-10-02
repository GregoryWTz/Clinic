const sequelize = require("./koneksi");
const DoctorController = require("./controllers/doctorController");
const categoryController = require("./controllers/categoryController");
const appointmentController = require("./controllers/appointmentController");
const recordController = require("./controllers/RecordController");
const querystring = require("querystring");

sequelize.sync().then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err);
});
const http = require("http");
const fs = require("fs");
const path = require("path");
const { console } = require("inspector");

const server = http.createServer((req, res) => {
    console.log(req.method + " / " + req.url);
    const urlsplit = req.url.split("/");

    if (req.url  === "/doctors" && req.method === "GET") {

        fs.readFile(path.join(__dirname, "views", "doctor.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                
                try{
                    
                   
                    DoctorController.getAllDoctor().then(doctors=>{
                        categoryController.getAllCategory().then(categories=>{
                            const html = data.toString().replace("<!--DOCTOR_DATA-->", JSON.stringify(doctors))
                            .replace("<!--CATEGORY_DATA-->", JSON.stringify(categories));
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        })
                    
                    });
                
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
    }
    else if (req.url  === "/appointment" && req.method === "POST") {
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", ()=>{
                const formData = querystring.parse(body);

                fs.readFile(path.join(__dirname, "views", "appointment.html"), (err, data) => {
                    if (err) {
                        console.log("Gagal memanggil view");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal melngambil view");
                    } 
                    else {
                        DoctorController.findDoctor(formData.id_doctor).then(doctors=>{
                            const html = data.toString().replace("<!--DOCTOR_DATA-->", JSON.stringify(doctors));
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        });
                        
                    }
                });
            });
        
    }

    else if(req.url  === "/createappointment" && req.method === "POST"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            console.log(body);
            if(!formData.id_doctor || !formData.id_patient || !formData.appointment_date ||!formData.appointment_time){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }

            try{
                appointmentController.createAppointment(formData).then(apt =>{
                    // console.log(apt);
                    res.writeHead(302, {"Location" : "/appointmentlist"});
                    res.end();
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
    }
    else if (req.url  === "/appointmentlist" && req.method === "GET") {
        fs.readFile(path.join(__dirname, "views", "appointmentList.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                
                try{
                    appointmentController.getAllSchedule("P001").then(apt=>{
                        const html = data.toString().replace("<!--APPOINTMENT_DATA-->", JSON.stringify(apt));
                        res.writeHead(200, {"Content-Type":"text/html"});
                        res.write(html);
                    });
             
                  
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
        
    }
    else if (urlsplit[2] === "delete" && urlsplit[1] === "appointmentlist" && req.method === "GET") {
        const id = urlsplit[3]; 
        try{
                appointmentController.deleteSchedule(id).then(apt =>{
                    // console.log(apt);
                    res.writeHead(302, {"Location" : "/appointmentlist"});
                    res.end();
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
    }
      else if (req.url  === "/medicalrecord" && req.method === "GET") {
        fs.readFile(path.join(__dirname, "views", "medicalRecord.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                
                try{
                    recordController.getAllRecord("P001").then(apt=>{
                        const html = data.toString().replace("<!--RECORD_DATA-->", JSON.stringify(apt));
                        res.writeHead(200, {"Content-Type":"text/html"});
                        console.log(apt);
                        res.write(html);
                    });
             
                  
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
        
    }
});
server.listen(3000, ()=> {
    console.log("server berhalan di http://localhost:3000");
});
