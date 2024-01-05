firebase.auth().onAuthStateChanged((user) => {
        if (user) {
                document.getElementById('userName').innerText = user.displayName;
                document.getElementById('userEmail').innerText = user.email;

                document.getElementById('tagSelect').addEventListener('change', (event) => {
                        const newTag = event.target.value;
                        firebase.database().ref('users/' + user.uid).update({
                                tag: newTag
                        });
                });

                document.getElementById('profilePicture').src = user.photoURL;

                document.getElementById('updateDisplayName').addEventListener('click', () => {
                        const newDisplayName = document.getElementById('displayNameInput').value;
                        user.updateProfile({
                                displayName: newDisplayName
                        }).then(() => {
                                document.getElementById('userName').innerText = newDisplayName;
                                firebase.database().ref('users/' + user.uid).update({
                                        displayName: newDisplayName
                                });
                        });
                });

                document.getElementById('uploadProfilePicture').addEventListener('click', () => {
                        profilePictureRef.put(profilePictureFile).then(snapshot => {
                            snapshot.ref.getDownloadURL().then(downloadURL => {
                                user.updateProfile({
                                    photoURL: downloadURL
                                }).then(() => {
                                    firebase.database().ref('users/' + user.uid).update({
                                        photoURL: downloadURL
                                    });
                                    document.getElementById('profilePicture').src = downloadURL;
                                });
                            });
                        });
                    });
        } else {

        }
});