


const sequelize = require("./koneksi");
const DoctorController = require("./controllers/doctorController");
const categoryController = require("./controllers/categoryController");


sequelize.sync().then((result)=>{
    // console.log(result);
}).catch((err)=>{
    // console.log(err);
});
const http = require("http");
const fs = require("fs");
const path = require("path");

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

});
server.listen(3000, ()=> {
    console.log("server berhalan di http://localhost:3000");
});
