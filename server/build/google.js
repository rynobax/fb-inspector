"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const { SECRET } = process.env;
if (!SECRET)
    throw Error('Secret is missing, check .ENV');
const client_id = '561478918972-vkd6611959mpitiq8rvs6484dktic5e6.apps.googleusercontent.com';
const redirect_uri = 'https://6781a2d3.ngrok.io/oauth';
const GRACE_PADDING = 1000 * 30;
function parseb64(s) {
    return Buffer.from(s, 'base64').toString();
}
function parseResponse(res) {
    if (!res.id_token)
        throw Error('No id token!');
    const middle = res.id_token.split('.')[1];
    const { email, sub: uid } = JSON.parse(parseb64(middle));
    const { expiry_date } = res;
    if (!expiry_date)
        throw Error('No expiry date!');
    if (!res.refresh_token)
        throw Error('No access_token!');
    if (!res.access_token)
        throw Error('No refresh_token!');
    return {
        email,
        uid,
        refresh_token: res.refresh_token,
        access_token: res.access_token,
        expires_at: expiry_date - GRACE_PADDING,
    };
}
function initToken({ code }) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(client_id, SECRET, redirect_uri);
    return new Promise((resolve, reject) => {
        oauth2Client.getToken(code, (err, res) => {
            if (err)
                reject(err);
            else if (!res)
                reject('No response from getToken!');
            else {
                resolve(parseResponse(res));
            }
        });
    });
}
exports.initToken = initToken;
function getAccessToken({ access_token, refresh_token, expiry_date, }) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(client_id, SECRET, redirect_uri);
    return new Promise((resolve, reject) => {
        oauth2Client.setCredentials({ access_token, refresh_token, expiry_date });
        oauth2Client.getAccessToken((err, res, req) => {
            if (err)
                reject(err);
            else if (!res)
                reject(`Got empty access token`);
            else if (!req)
                reject('Did not get expiry_date');
            else {
                const { expiry_date } = req.data;
                const expires_at = expiry_date - GRACE_PADDING;
                resolve({ access_token: res, expires_at });
            }
        });
    });
}
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dvb2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUdwQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUMvQixJQUFJLENBQUMsTUFBTTtJQUFFLE1BQU0sS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDMUQsTUFBTSxTQUFTLEdBQ2IsMEVBQTBFLENBQUM7QUFDN0UsTUFBTSxZQUFZLEdBQUcsaUNBQWlDLENBQUM7QUFFdkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVoQyxTQUFTLFFBQVEsQ0FBQyxDQUFTO0lBQ3pCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0MsQ0FBQztBQVdELFNBQVMsYUFBYSxDQUFDLEdBQWdCO0lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUFFLE1BQU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDekQsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUM1QixJQUFJLENBQUMsV0FBVztRQUFFLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhO1FBQUUsTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFBRSxNQUFNLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hELE9BQU87UUFDTCxLQUFLO1FBQ0wsR0FBRztRQUNILGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYTtRQUNoQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7UUFDOUIsVUFBVSxFQUFFLFdBQVcsR0FBRyxhQUFhO0tBQ3hDLENBQUM7QUFDSixDQUFDO0FBTUQsU0FBZ0IsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFtQjtJQUNqRCxNQUFNLFlBQVksR0FBRyxJQUFJLG1CQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzdFLE9BQU8sSUFBSSxPQUFPLENBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JELFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3ZDLElBQUksR0FBRztnQkFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxHQUFHO2dCQUFFLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2lCQUMvQztnQkFDSCxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVhELDhCQVdDO0FBYUQsU0FBZ0IsY0FBYyxDQUFDLEVBQzdCLFlBQVksRUFDWixhQUFhLEVBQ2IsV0FBVyxHQUNVO0lBQ3JCLE1BQU0sWUFBWSxHQUFHLElBQUksbUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDN0UsT0FBTyxJQUFJLE9BQU8sQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDN0QsWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUMxRSxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM1QyxJQUFJLEdBQUc7Z0JBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQixJQUFJLENBQUMsR0FBRztnQkFBRSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztpQkFDM0MsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7aUJBQzVDO2dCQUNILE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxNQUFNLFVBQVUsR0FBRyxXQUFXLEdBQUcsYUFBYSxDQUFDO2dCQUMvQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7YUFDNUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQW5CRCx3Q0FtQkMifQ==