const path = require("path");
const fs = require("fs");
const Busboy = require("busboy");

const busyBoyFileParser = async (req, res, next) => {
    const busboy = new Busboy({ headers: req.headers });
  console.log("Heeelo")
    // This object will accumulate all the fields, keyed by their name
    const bodyFields = {};
  
    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = new Object();
  
    // This code will process each non-file field in the form.
    busboy.on("field", (fieldname, val) => {
     console.log(`Processed field ${fieldname}: ${val}.`);
      bodyFields[fieldname] = val;
    });
  
    const fileWrites = [];
  
    // This code will process each file uploaded.
    busboy.on("file", (fieldname, file, filename) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      // console.log(`Processed file ${filename}`);
      req.imageField = fieldname;
      const fileName = Date.now() + "-" + filename;
      const filepath = path.join(__dirname, "../uploads", fileName);
      if (Object.keys(uploads).length === 0) {
        uploads[fieldname] = [fileName];
        console.log(uploads);
      } else {
        uploads[fieldname] = [...uploads[fieldname], fileName];
      }
  
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);
  
      // File was processed by Busboy; wait for it to be written.
      // Note: GCF may not persist saved files across invocations.
      // Persistent files must be kept in other locations
      // (such as Cloud Storage buckets).
      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
      fileWrites.push(promise);
    });
  
    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      await Promise.all(fileWrites);
  
      /**
       * TODO(developer): Process saved files here
       */
      // for (const file in uploads) {
      //   fs.unlinkSync(uploads[file]);
      // }
      // res.send();
      req.bodyFields = bodyFields;
      req.uploads = uploads;
      next();
    });
  
    busboy.end(req.rawBody);
  };
  module.exports=busyBoyFileParser;