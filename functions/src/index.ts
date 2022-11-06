import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import * as os from "os";
const webp = require("webp-converter");

require("firebase-functions/logger/compat");

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

				const userId = bucketImgPath.split("/")[1];
				const postId = bucketImgPath.split("/")[2];
				const imgId = object.name?.split("/")[3][-1]

				// Find the school id
				admin.firestore().collection("users").doc(userId).get().then((doc) => {
					const schoolId = doc.get("school")

					// Update records
					admin.firestore().collection("schools").doc(schoolId).collection("users").doc(userId).collection("posts")
						.doc(postId).get().then((doc) => {
							const images = doc.get("images")

							console.log('Fetched images:', images)

							admin.firestore().collection("schools").doc(schoolId).collection("users").doc(userId)
								.collection("posts").doc(postId).update({ images: arrayRemove(imgId) }).then(() => {

								admin.firestore().collection("schools").doc(schoolId).collection("users").doc(userId)
									.collection("posts").doc(postId).update({ images: arrayUnion(webpImgName) }).then(() => {
										
										console.log("Updated post images successfully.")
									}).catch((err: any) => { console.error("Error adding new post image ref:", err) }
							}).catch((err: any) => { console.error("Error removing post image ref:", err) }
						}).catch((err: any) => { console.error("Error fetching post:", err) }
				})


			}).catch((err: Error) => {
				console.log("Error uploading webp file:", err);
			});
		});
	})
	.catch((err) => {
		console.log("Error downloading image from data storage:", err);
	});
});
