import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as os from "os";
const webp = require("webp-converter");

export const convertImg = functions.storage.bucket("clowncar-d0f6a.appspot.com").object()
	.onFinalize((object: functions.storage.ObjectMetadata) => {

	if (object.name === null || object.name === undefined || object.name === "" || object.name?.endsWith(".webp")) {
		console.log("Not converting file.");
		return;
	}

	const bucketImgPath: string = object.name;
	const webpImgName = bucketImgPath.split(".").slice(0, -1).join(".") + ".webp";
	const tmpFilePath = os.tmpdir() + "/" + object.name;
	const tmpFilePathWebp = os.tmpdir() + "/" + webpImgName;
	const imgBucket = admin.storage().bucket(object.bucket);

	imgBucket.file(bucketImgPath).download({ destination: tmpFilePath }).then((data) => {
		console.log("Downloaded image to:", tmpFilePath);
		webp.cwebp(tmpFilePath, tmpFilePathWebp, "-q 80").then((response: any) => {
			console.log("Webp converter response:", response);
			imgBucket.upload(tmpFilePathWebp, { destination: webpImgName }).then(() => {
				console.log("Webp file uploaded successfully at", webpImgName);

				imgBucket.file(bucketImgPath).delete().then(() => {
					console.log("Original image file deleted successfully.");
				}).catch((err: any) => {
					console.error("Error deleting original file:", err);
				});

			}).catch((err: Error) => {
				console.log("Error uploading webp file:", err);
			});
		});
	})
	.catch((err) => {
		console.log("Error downloading image from data storage:", err);
	});
});
