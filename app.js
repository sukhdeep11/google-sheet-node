const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");


exports.readSheet = (range) => {

  return new Promise(resolve => {


    // If modifying these scopes, delete token.json.
    const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

    const TOKEN_PATH = "token.json";

    // Load client secrets from a local file.
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), listMajors);
    });

    function authorize(credentials, callback) {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    function getNewToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url:", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Enter the code from that page here: ", code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err)
            return console.error(
              "Error while trying to retrieve access token",
              err
            );
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
            if (err) return console.error(err);
            console.log("Token stored to", TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }



    var listMajors = auth => {
      const sheets = google.sheets({ version: "v4", auth });
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: "1tItBL8bojfw1mw-799bJZFIBzeRyt8vzoeOIG9pAgAU",
          range
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const rows = res.data.values;
          let testimonialArray = [];
          if (rows.length) {
            rows.map(async row => {
              var data = {
                name: row[0],
                company: row[1],
                image: row[2],
                testimonial: row[3],
              };
              testimonialArray.push(data);
            });
            resolve(testimonialArray);
          } else {
            console.log("No data found.");
          }
        }
      );
    };
  });
}