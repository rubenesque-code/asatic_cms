/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

//* functions need to be deployed. Run `firebase deploy --only functions`

admin.initializeApp();

exports.addAdminRole = functions
  .region("europe-west2")
  .https.onCall(async (email, _context) => {
    return admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
          admin: true,
        });
      })
      .then(() => {
        return {
          message: `Success! ${email} has been made an admin`,
        };
      })
      .catch((err) => err);
  });

exports.computeIsAdminByEmail = functions
  .region("europe-west2")
  .https.onCall(async (email, _context) => {
    try {
      const user = await admin.auth().getUserByEmail(email);
      // * If no user, an error will be thrown

      const isAdmin = user.customClaims.admin === true;

      if (isAdmin) {
        return {
          isAdmin: true,
        };
      }

      return {
        isAdmin: false,
      };
    } catch (error) {
      return {
        isAdmin: false,
      };
    }
  });
