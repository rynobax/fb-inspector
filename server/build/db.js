"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const google = __importStar(require("./google"));
const errors_1 = require("./errors");
const db = new nedb_1.default({
    filename: './datastore/data.nedb',
    autoload: true,
});
function upsert(doc) {
    return new Promise((resolve, reject) => {
        getDoc({ email: doc.email }).then(oldDoc => {
            if (!oldDoc) {
                db.insert({ __id: doc.email, ...doc }, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(doc);
                });
            }
            else {
                db.update({ email: doc.email }, doc, {}, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(doc);
                });
            }
        });
    });
}
function updateAccessToken({ email, access_token, expires_at, }) {
    return new Promise((resolve, reject) => {
        db.update({ email }, { $set: { access_token, expires_at } }, {}, err => {
            if (err)
                reject(err);
            else {
                getDoc({ email })
                    .then(doc => {
                    if (!doc)
                        throw Error('Could not find doc after updating access token');
                    resolve(doc);
                })
                    .catch(reject);
            }
        });
    });
}
const getDoc = ({ email }) => new Promise((resolve, reject) => {
    db.findOne({ __id: email }, (err, doc) => {
        if (err)
            reject(err);
        else
            resolve(doc);
    });
});
async function getAccessToken({ email }) {
    const doc = await getDoc({ email });
    if (!doc)
        throw new errors_1.MissingEmailError(`No doc for ${email}`);
    if (doc.expires_at && Date.now() < doc.expires_at) {
        // Still active, return current token
        return doc;
    }
    else {
        // Need to refresh, get new token
        const { access_token, expires_at } = await google.getAccessToken({
            access_token: doc.access_token,
            refresh_token: doc.refresh_token,
            expiry_date: doc.expires_at,
        });
        return updateAccessToken({ email, access_token, expires_at });
    }
}
exports.getAccessToken = getAccessToken;
async function initToken({ code }) {
    const { access_token, refresh_token, expires_at, email, } = await google.initToken({ code });
    return upsert({ access_token, refresh_token, expires_at, email });
}
exports.initToken = initToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTZCO0FBQzdCLGlEQUFtQztBQUNuQyxxQ0FBNkM7QUFFN0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxjQUFTLENBQU07SUFDNUIsUUFBUSxFQUFFLHVCQUF1QjtJQUNqQyxRQUFRLEVBQUUsSUFBSTtDQUNmLENBQUMsQ0FBQztBQVNILFNBQVMsTUFBTSxDQUFDLEdBQVE7SUFDdEIsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMxQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQzNDLElBQUksR0FBRzt3QkFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O3dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDN0MsSUFBSSxHQUFHO3dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7d0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFD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